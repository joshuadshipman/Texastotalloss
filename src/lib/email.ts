import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export async function sendLeadEmailPacket(lead: any) {
    const html = `
    <h2>New Total Loss + Injury Lead</h2>
    <p><strong>ID:</strong> ${lead.id}</p>
    <h3>Contact</h3>
    <p>${lead.full_name || 'N/A'} – ${lead.phone || 'N/A'} – ${lead.email || 'No email'}</p>
    <p>State: ${lead.state || ''}</p>
    <h3>Crash</h3>
    <p>Date: ${lead.crash_date || ''}, Role: ${lead.role || ''}</p>
    <h3>Total Loss</h3>
    <p>${lead.vehicle_year || ''} ${lead.vehicle_make || ''} ${lead.vehicle_model || ''}</p>
    <p>ZIP: ${lead.vehicle_zip || ''}</p>
    <p>Insurer: ${lead.insurer_name || ''}</p>
    <p>Offer: ${lead.total_loss_offer_amount || ''}</p>
    <h3>Injuries</h3>
    <p>Has injury: ${lead.has_injury}</p>
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
            to: 'intake@yourdomain.com', // In production this would be configurable
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

    const mailOptions = {
        from: process.env.FROM_EMAIL || '"Texas Total Loss" <alerts@texastotalloss.com>',
        to: 'joshua@texastotalloss.com', // TODO: Make configurable or use env var
        subject: `🔔 NEW CHAT STARTED: ${data.userName} (${data.language.toUpperCase()})`,
        text: `
      URGENT: New Chat Session Started
      
      User: ${data.userName}
      Language: ${data.language}
      Session ID: ${data.sessionId}
      
      Initial Message / Intent:
      ${data.initialMessage}
      
      Go to Admin Dashboard to respond!
    `,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #d32f2f;">🔔 New Live Chat Started</h2>
        <p><strong>User:</strong> ${data.userName}</p>
        <p><strong>Language:</strong> ${data.language.toUpperCase()}</p>
        <p><strong>Session ID:</strong> ${data.sessionId}</p>
        <hr />
        <p><strong>Initial Message/Context:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #2196F3;">
          ${data.initialMessage}
        </blockquote>
        <br />
        <a href="https://texastotalloss.com/admin" style="display: inline-block; padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Admin Dashboard</a>
      </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Chat alert sent for session ${data.sessionId}`);
    } catch (error) {
        console.error('Error sending chat alert:', error);
    }
}
