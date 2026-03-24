import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Attorney Intake Notification (Deep Link Only)
 * Notifies the attorney team of a "Hot Lead" and links to the Portal.
 * Does NOT dump full data in email for security and protocol compliance.
 */
export async function sendAttorneyIntakeAlert(data: {
    to: string,
    clientName: string,
    liabilityScore: 'High' | 'Medium' | 'Low',
    sessionId: string
}) {
    const portalUrl = `https://texastotalloss.com/admin/leads/${data.sessionId}`;
    
    const html = `
        <div style="font-family: Arial; padding: 20px; border: 1px solid #ddd; border-top: 5px solid #2196F3;">
            <h2 style="color: #1a73e8;">🔥 HOT LEAD ALERT: ${data.clientName}</h2>
            <p>A new high-priority lead has been processed by the TTL Predictive Engine.</p>
            
            <div style="background: #eef6ff; padding: 15px; border-radius: 5px;">
                <p><strong>Liability Score:</strong> ${data.liabilityScore}</p>
                <p><strong>Action:</strong> Review documentation, medical logs, and evidence in the Portal.</p>
            </div>
            
            <br />
            <a href="${portalUrl}" style="background: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">OPEN IN PORTAL</a>
            
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
                Note: Full evidence capture and pain logs are available exclusively via the secure portal.
            </p>
        </div>
    `;

    await sendGenericEmail({
        to: data.to,
        subject: `[TTL] Hot Lead Alert: ${data.clientName} (${data.liabilityScore} Liability)`,
        html
    });
}

// Existing Exports Maintained Below

export async function sendLeadEmailPacket(lead: any) {
    const html = `
    <h2>New Total Loss + Injury Lead</h2>
    <p><strong>ID:</strong> ${lead.id}</p>
    <h3>Contact</h3>
    <p>${lead.full_name || 'N/A'} – ${lead.phone || 'N/A'} – ${lead.email || 'No email'}</p>
    <p>Best Time: ${lead.preferred_contact_time || 'any'}</p>
    <p>State: ${lead.state || 'TX'}</p>
    <h3>Scores</h3>
    <p><strong>Algorithm Score:</strong> ${lead.score}</p>
    <p>Pain Level: ${lead.pain_level}</p>
    <h3>Crash & Vehicle</h3>
    <p>Date: ${lead.accident_date || lead.crash_date || 'N/A'}</p>
    <p>Role: ${lead.role || 'N/A'}</p>
    <p>Description: ${lead.description || 'N/A'}</p>
    <p>${lead.vehicle_year || ''} ${lead.vehicle_make || ''} ${lead.vehicle_model || ''}</p>
    <p>VIN: ${lead.vehicle_vin || 'N/A'}</p>
    <p>Insurer: ${lead.insurer_name || 'N/A'} (Claim #: ${lead.claim_number || 'N/A'})</p>
    <p>Offer: ${lead.total_loss_offer_amount || 'N/A'}</p>
    <h3>Injuries</h3>
    <p>Has injury: ${lead.has_injury}</p>
    <p>Summary: ${lead.injury_summary || 'N/A'}</p>
    <p>Areas: ${(lead.injury_areas || []).join(', ')}</p>
    <p>Treatment started: ${lead.treatment_started}</p>
    <h3>Attachments</h3>
    <p>Vehicle photos:<br>${(lead.vehicle_photos_urls || []).join('<br>') || 'None'}</p>
    <p>Injury photos:<br>${(lead.injury_photos_urls || []).join('<br>') || 'None'}</p>
    <p>Police report:<br>${(lead.police_report_urls || []).join('<br>') || 'None'}</p>
    <p>Other docs:<br>${(lead.other_docs_urls || []).join('<br>') || 'None'}</p>
  `;

    try {
        await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: ['intake@yourdomain.com', 'jds@pmaction.com'], 
            subject: `New Total Loss + Injury Lead: ${lead.id}`,
            html
        });
        console.log(`Email sent for lead ${lead.id}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export async function sendChatAlertEmail(data: {
    sessionId: string;
    userName: string;
    language: string;
    initialMessage: string;
}) {
    if (!process.env.SMTP_USER) return;

    const recipientList = ['joshua@texastotalloss.com'];
    if (process.env.NOTIFY_PHONE_EMAIL) {
        recipientList.push(process.env.NOTIFY_PHONE_EMAIL);
    }

    const mailOptions = {
        from: process.env.FROM_EMAIL || '"Texas Total Loss" <alerts@texastotalloss.com>',
        to: recipientList.join(','), 
        subject: `🔔 New Chat: ${data.userName} (${data.language.toUpperCase()})`,
        text: `
      URGENT: New Chat Started
      User: ${data.userName} (${data.language})
      Session: ${data.sessionId}
      
      Message:
      "${data.initialMessage}"
      
      Link: https://texastotalloss.com/admin/chat
    `,
        html: `
      <div style="font-family: sans-serif; padding: 16px; border: 1px solid #e0e0e0; border-radius: 12px; max-width: 400px; margin: auto;">
        <h2 style="color: #d32f2f; margin-top: 0;">🔔 New Live Chat</h2>
        <p style="font-size: 16px;"><strong>${data.userName}</strong> is waiting.</p>
        <div style="background: #f5f5f5; padding: 12px; border-radius: 8px; border-left: 4px solid #2196F3; margin: 16px 0;">
          "${data.initialMessage}"
        </div>
        <a href="https://texastotalloss.com/admin/chat" style="display: block; text-align: center; padding: 14px; background: #2196F3; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">OPEN DASHBOARD</a>
        <p style="font-size: 10px; color: #999; margin-top: 16px; text-align: center;">Session ID: ${data.sessionId}</p>
      </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Chat alert sent for session ${data.sessionId} to ${recipientList.length} recipients`);
    } catch (error) {
        console.error('Error sending chat alert:', error);
    }
}

export async function sendGenericEmail(data: {
    to: string;
    subject: string;
    html: string;
    text?: string;
}) {
    if (!process.env.SMTP_USER) return;

    try {
        await transporter.sendMail({
            from: process.env.FROM_EMAIL || '"Texas Total Loss" <alerts@texastotalloss.com>',
            to: data.to,
            subject: data.subject,
            html: data.html,
            text: data.text
        });
        console.log(`Generic email sent to ${data.to}`);
    } catch (error) {
        console.error('Error sending generic email:', error);
    }
}
