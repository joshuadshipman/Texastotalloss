import { google } from 'googleapis';

// Google Business Profile Automation
// Zero-Cost: Uses official Google My Business API
// Docs: https://developers.google.com/my-business/content/posts-data

const oauth2Client = new google.auth.OAuth2(
    process.env.GBP_CLIENT_ID,
    process.env.GBP_CLIENT_SECRET,
    process.env.GBP_REDIRECT_URI
);

// Credentials must be stored securely (e.g., Supabase or env)
// For now, we assume a refresh token is available
if (process.env.GBP_REFRESH_TOKEN) {
    oauth2Client.setCredentials({ refresh_token: process.env.GBP_REFRESH_TOKEN });
}

// Note: The library 'googleapis' doesn't have full GBP typing by default, so we use 'any' or raw requests
// URL: https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/localPosts

export interface GBPPost {
    summary: string; // The text content
    topicType: 'STANDARD' | 'EVENT' | 'OFFER' | 'ALERT';
    callToAction: {
        actionType: 'LEARN_MORE' | 'CALL' | 'BOOK';
        url: string;
    };
    media?: {
        sourceUrl: string; // Image URL
    }
}

export async function postToGoogleBusinessProfile(locationId: string, post: GBPPost) {
    console.log(`[Mock GBP] Posting to ${locationId}:`, post.summary);

    // In a real implementation with valid keys, we would do:
    /*
    const url = `https://mybusiness.googleapis.com/v4/${locationId}/localPosts`;
    const res = await oauth2Client.request({
        url,
        method: 'POST',
        data: {
            languageCode: 'en-US',
            summary: post.summary,
            topicType: post.topicType,
            callToAction: post.callToAction,
            media: post.media ? [{
                mediaFormat: 'PHOTO',
                sourceUrl: post.media.sourceUrl
            }] : []
        }
    });
    return res.data;
    */

    return { status: 'success', mock_id: 'gbp_12345' };
}

export function generateGBPUpdateFromBlog(blogTitle: string, blogSlug: string, city: string) {
    return {
        summary: `🚗 Total Loss in ${city}? New Guide: ${blogTitle}. Learn how to dispute your valuation and get paid what you deserve. #TotalLoss #${city} #CarAccident`,
        topicType: 'STANDARD',
        callToAction: {
            actionType: 'LEARN_MORE',
            url: `https://texastotalloss.com/blog/${blogSlug}`
        }
    } as GBPPost;
}
