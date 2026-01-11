import { NextResponse } from 'next/server';
import { sendGenericEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { leadId, filePath, uploaderName, uploaderEmail } = data;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/evidence/${filePath}`;

        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 600px;">
                <h2 style="color: #10b981;">📸 New Evidence Uploaded</h2>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
                
                <p><strong>Lead ID:</strong> ${leadId}</p>
                <p><strong>Uploader:</strong> ${uploaderName || 'Unknown'} (${uploaderEmail || 'No email'})</p>
                
                <h3 style="margin-top: 20px;">Photo Preview</h3>
                <img src="${publicUrl}" alt="Evidence Photo" style="max-width: 100%; max-height: 300px; border-radius: 8px; border: 1px solid #e5e7eb;" />
                
                <p style="margin-top: 20px;">
                    <a href="${publicUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        View Full Image
                    </a>
                </p>
                
                <p style="margin-top: 20px;">
                    <a href="https://texastotalloss.com/admin" style="display: inline-block; padding: 10px 20px; background-color: #6b7280; color: white; text-decoration: none; border-radius: 6px;">
                        Open Admin Dashboard
                    </a>
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="font-size: 12px; color: #9ca3af;">This notification was sent from TexasTotalLoss.com Evidence System</p>
            </div>
        `;

        await sendGenericEmail({
            to: 'jds@pmaction.com',
            subject: `📸 New Evidence Uploaded - Lead #${leadId}`,
            html,
            text: `New evidence uploaded for Lead #${leadId}. View at: ${publicUrl}`
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Evidence notification error:', error);
        return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
    }
}
