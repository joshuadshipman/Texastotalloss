import { google } from 'googleapis';
import { cities, CityData } from '@/data/cities';

// Zero-Cost Outreach System: Uses Gmail API instead of expensive CRM
// Requirement: Service Account or OAuth2 Token for 'admin@texastotalloss.com'

const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
);

// Set credentials (token must be refreshed via a separate auth flow initially)
oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

interface OutreachTarget {
    businessName: string;
    city: string;
    type: 'Hospital' | 'Towing' | 'Repair';
    email?: string; // We would need to manually enrich this or use a lookup tool later
    linkOnOurSite: string;
}

export async function generateOutreachCampaign(citySlug: string) {
    const city = cities.find(c => c.slug === citySlug);
    if (!city || !city.resources) return;

    const targets: OutreachTarget[] = [];
    const link = `https://texastotalloss.com/locations/${city.slug}`;

    // Collect Targets
    city.resources.hospitals?.forEach(h => {
        targets.push({ businessName: h.name, city: city.translations.en.name, type: 'Hospital', linkOnOurSite: link });
    });
    city.resources.towing?.forEach(t => {
        targets.push({ businessName: t.name, city: city.translations.en.name, type: 'Towing', linkOnOurSite: link });
    });

    // In a real run, we would iterate and send. For now, we return the DRAFTS.
    return targets.map(t => createDraftEmail(t));
}

function createDraftEmail(target: OutreachTarget) {
    const subject = `Featured: ${target.businessName} is listed as a Top Resource in ${target.city}`;

    const body = `
    Hi Team at ${target.businessName},

    I'm the Content Director at Texas Total Loss.
    
    We recently updated our "Emergency Resources for ${target.city}" guide, and we featured your business as a trusted provider for local residents dealing with accidents.
    
    You can see the listing here: ${target.linkOnOurSite}
    
    We want to make sure your details (Hours, Phone) are 100% accurate. If you see anything that needs changing, just reply and let me know.
    
    Best,
    The Texas Total Loss Team
    `;

    // In production, this would use gmail.users.messages.send
    return {
        to: "info@example.com (needs lookup)",
        subject,
        body
    };
}
