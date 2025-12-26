
const fetch = require('node-fetch');

async function testAdminChat() {
    console.log('Testing Admin Chat API...');
    try {
        const response = await fetch('http://localhost:3000/api/admin/get-chat-sessions');
        console.log('Status:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('Sessions Found:', data.sessions?.length || 0);
            if (data.sessions && data.sessions.length > 0) {
                console.log('First Session ID:', data.sessions[0].session_id);
                console.log('First Session Status:', data.sessions[0].status);
            }
        } else {
            console.log('Error Text:', await response.text());
        }
    } catch (e) {
        console.error('Fetch failed:', e);
    }
}

testAdminChat();
