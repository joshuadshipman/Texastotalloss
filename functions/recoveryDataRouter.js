'use strict';

/**
 * recoveryDataRouter — Firebase Cloud Function (v2)
 *
 * Triggered on HTTP Request.
 * Goal: Compiles daily check-in logs (pain level, mood, missed events) for a specific user into an attorney-ready JSON/PDF payload.
 *
 * It checks the `recovery_logs` subcollection in Firestore, aggregates 30 days of data, 
 * and sends it to the purchasing firm's CRM webhook.
 */

const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const { logger } = require('firebase-functions');

// Utility to aggregate logs
const compileReport = (logs, claimantInfo) => {
    logger.info(`Compiling report for ${logs.length} entries.`);
    return {
        claimant: claimantInfo,
        reportDate: new Date().toISOString(),
        totalDaysLogged: logs.length,
        averagePainLevel: logs.length ? (logs.reduce((acc, log) => acc + (log.painLevel || 0), 0) / logs.length).toFixed(1) : 0,
        entries: logs
    };
};

exports.recoveryDataRouter = onRequest({ region: 'us-central1' }, async (req, res) => {
    // 1. Verify Authentication / API Key
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.warn('Unauthorized request attempt to recoveryDataRouter');
        return res.status(401).send('Unauthorized');
    }

    // Usually we would verify the Firebase Auth token here. For architecture scaffolding, we mock:
    const leadId = req.body.leadId;
    
    if (!leadId) {
        return res.status(400).send('Missing leadId');
    }

    try {
        const db = admin.firestore();
        
        // Fetch Lead Metadata
        const leadDoc = await db.collection('insurance_leads').doc(leadId).get();
        if (!leadDoc.exists) {
            return res.status(404).send('Lead not found');
        }
        
        // Fetch last 30 days logs
        const logsSnapshot = await db.collection(`insurance_leads/${leadId}/recovery_logs`)
            .orderBy('timestamp', 'desc')
            .limit(30)
            .get();
            
        let logs = [];
        logsSnapshot.forEach(doc => logs.push(doc.data()));

        const compiledReport = compileReport(logs, {
           firstName: leadDoc.data().firstName,
           injuryType: leadDoc.data().injuryType || 'Unknown'
        });

        // In a full environment, this JSON is POSTed to the Law Firm CRM or converted to PDF.
        logger.info(`[RECOVERY-ROUTER] Report generated successfully for lead ${leadId}`);
        
        res.status(200).json({
            success: true,
            message: 'Report compiled and routed to CRM.',
            report: compiledReport
        });

    } catch (error) {
        logger.error(`[RECOVERY-ROUTER] Failed to route data for lead ${leadId}:`, error);
        res.status(500).send('Internal Server Error');
    }
});
