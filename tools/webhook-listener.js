const http = require('http');

const PORT = 3005;

const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const timestamp = new Date().toISOString();
        console.log(`\n[${timestamp}] Request Received: ${req.method} ${req.url}`);
        console.log('Headers:', JSON.stringify(req.headers, null, 2));

        try {
            const jsonBody = JSON.parse(body);
            console.log('Payload:', JSON.stringify(jsonBody, null, 2));
        } catch (e) {
            console.log('Body:', body);
        }

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Webhook received');
    });
});

server.listen(PORT, () => {
    console.log(`Webhook listener running at http://localhost:${PORT}`);
    console.log('Waiting for incoming webhooks...');
});
