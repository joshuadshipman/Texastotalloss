
async function verify() {
    console.log('Verifying APIs on port 3001...');
    try {
        const res = await fetch('http://localhost:3001/api/admin/get-chat-sessions');
        console.log(`Chat Sessions API: ${res.status} ${res.statusText}`);
    } catch (e) { console.log('Chat Error:', e.cause || e.message); }

    try {
        const res = await fetch('http://localhost:3001/api/admin/blog-posts');
        console.log(`Blog API: ${res.status} ${res.statusText}`);
    } catch (e) { console.log('Blog Error:', e.cause || e.message); }
}
verify();
