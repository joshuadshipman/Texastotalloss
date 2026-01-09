import { NextRequest, NextResponse } from 'next/server';
import { sendGenericEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Extract headers (Vercel/NextJS specific)
        const ip = req.headers.get('x-forwarded-for') || 'Unknown IP';
        const city = req.headers.get('x-vercel-ip-city') || 'Unknown City';
        const region = req.headers.get('x-vercel-ip-country-region') || 'Unknown Region';
        const country = req.headers.get('x-vercel-ip-country') || 'Unknown Country';

        const { page, referrer, userAgent } = body;

        // Send Email to Admin
        const subject = `🔔 New Site Visitor: ${city}, ${region}`;
        const html = `
            <h2>New Visitor Detected</h2>
            <p><strong>Location:</strong> ${city}, ${region}, ${country}</p>
            <p><strong>Page:</strong> ${page}</p>
            <p><strong>Referrer:</strong> ${referrer || 'Direct'}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>IP:</strong> ${ip}</p>
            <p><strong>UA:</strong> ${userAgent}</p>
        `;

        await sendGenericEmail({
            to: process.env.SMTP_USER || 'admin@texastotalloss.com', // Default or Env
            subject,
            html
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Visitor Notify Error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
