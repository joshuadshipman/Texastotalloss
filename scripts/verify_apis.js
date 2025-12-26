
const fetch = require('node-fetch');

async function verify() {
    console.log('Verifying APIs on port 3001...');
    // 1. Verify Admin Chat Sessions
    try {
        const res = await fetch('http://localhost:3001/api/admin/get-chat-sessions');
        console.log(`Chat Sessions API: ${res.status} ${res.statusText}`);
        if (res.ok) console.log('Chat Sessions OK');
        else console.log('Chat Sessions FAILED');
    } catch (e) { console.log('Chat Sessions/Network Error', e.message); }

    // 2. Verify Blog Posts
    try {
        const res = await fetch('http://localhost:3001/api/admin/blog-posts');
        console.log(`Blog Posts API: ${res.status} ${res.statusText}`);
        if (res.ok) console.log('Blog Posts OK');
        else console.log('Blog Posts FAILED');
    } catch (e) { console.log('Blog Posts/Network Error', e.message); }
}

setTimeout(verify, 5000); // Wait for server boot
