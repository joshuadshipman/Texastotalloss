
async function verify() {
    console.log('Verifying APIs on port 3000...');
    try {
        const res = await fetch('http://localhost:3000/api/admin/get-chat-sessions');
        const json = await res.json().catch(() => ({}));
        console.log(`Chat Sessions API: ${res.status} ${res.statusText}`);
        if (res.ok) console.log('Chat Data:', JSON.stringify(json).substring(0, 100));
        else console.log('Chat Error Body:', json);
    } catch (e) { console.log('Chat Error:', e.cause || e.message); }

    try {
        const res = await fetch('http://localhost:3000/api/admin/blog-posts');
        const json = await res.json().catch(() => ({}));
        console.log(`Blog API: ${res.status} ${res.statusText}`);
        if (res.ok) console.log('Blog Data:', JSON.stringify(json).substring(0, 100));
        else console.log('Blog Error Body:', json);
    } catch (e) { console.log('Blog Error:', e.cause || e.message); }
}
verify();
