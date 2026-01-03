
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2'; // Will need to install this

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json({ error: 'Missing content to tweet' }, { status: 400 });
        }

        // 1. Check Keywords
        const appKey = process.env.TWITTER_API_KEY;
        const appSecret = process.env.TWITTER_API_SECRET;
        const accessToken = process.env.TWITTER_ACCESS_TOKEN;
        const accessSecret = process.env.TWITTER_ACCESS_SECRET;

        if (!appKey || !appSecret || !accessToken || !accessSecret) {
            return NextResponse.json({
                error: 'Twitter API credentials missing. Please add TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET to .env.local',
                missingKeys: true
            }, { status: 400 });
        }

        // 2. Initialize Client
        const client = new TwitterApi({
            appKey,
            appSecret,
            accessToken,
            accessSecret,
        });

        // 3. Post Tweet (Thread support logic can be added later, for now single post or split)
        // Simple logic: If content is long, just post first 280 chars or full content if it fits?
        // Better: Expect an array of strings for a thread. 
        // For MVP: Let's assume input is a single string and we tweet it.

        // Parse the raw markdown content to extract tweets if passed raw? 
        // Or assume frontend passes an array? 
        // Let's assume the frontend separates it or sends the raw text.
        // If we send raw markdown, we might hit limits. 
        // Let's try to post as a thread if array, or single tweet if string.

        let result;
        if (Array.isArray(content)) {
            result = await client.v2.tweetThread(content);
        } else {
            result = await client.v2.tweet(content.substring(0, 280)); // Truncate safety
        }

        return NextResponse.json({ success: true, data: result });

    } catch (error: any) {
        console.error('Twitter Post Error:', error);
        return NextResponse.json({ error: error.message || 'Unknown Twitter Error' }, { status: 500 });
    }
}
