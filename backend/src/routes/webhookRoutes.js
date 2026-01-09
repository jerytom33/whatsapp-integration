const express = require('express');
const router = express.Router();
const db = require('../services/db');

// In-memory logs (circular buffer)
const webhookLogs = [];
const MAX_LOGS = 50;

// Webhook verification (GET) - often required by WhatsApp/Facebook
router.get('/whatsapp', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        // If not a verification request, might be just a health check or similar
        res.sendStatus(400);
    }
});

// Webhook reception (POST)
router.post('/whatsapp', async (req, res) => {
    try {
        const body = req.body;
        console.log('Received webhook:', JSON.stringify(body, null, 2));

        // Store log
        webhookLogs.unshift({
            timestamp: new Date(),
            payload: body
        });
        if (webhookLogs.length > MAX_LOGS) {
            webhookLogs.pop();
        }

        // Process webhook logic here
        // Handle AOC Portal Flat Format
        if (body.event === 'message_received' && body.messages) {
            let phone = body.from;
            // Ensure phone has '+' prefix for consistency
            if (phone && !phone.startsWith('+')) {
                phone = '+' + phone;
            }

            const name = body.contacts?.profileName || phone;
            const msg = body.messages;
            const msgId = body.messageId;

            // 1. Upsert Conversation
            let preview = 'Media Message';
            if (msg.type === 'text') preview = msg.text.body;
            else if (msg.type === 'interactive') preview = 'Interactive Message';

            const conversation = await db.upsertConversation(phone, name, preview);

            // 2. Save Message
            let content = {};
            if (msg.type === 'text') content = { body: msg.text.body };
            else content = msg[msg.type] || {};

            await db.saveMessage(
                conversation.id,
                'INBOUND',
                msg.type,
                content,
                'read',
                msgId
            );
            console.log(`Saved INBOUND message from ${phone}`);
        } else if (body.object && body.entry) {
            // Keep Meta format as fallback just in case
            for (const entry of body.entry) {
                for (const change of entry.changes) {
                    const value = change.value;
                    if (value.messages) {
                        for (const msg of value.messages) {
                            const phone = msg.from;
                            const name = value.contacts?.[0]?.profile?.name || phone;

                            // 1. Upsert Conversation
                            let preview = 'Media Message';
                            if (msg.type === 'text') preview = msg.text.body;
                            else if (msg.type === 'interactive') preview = 'Interactive Message';

                            const conversation = await db.upsertConversation(phone, name, preview);

                            // 2. Save Message
                            let content = {};
                            if (msg.type === 'text') content = { body: msg.text.body };
                            else content = msg[msg.type] || {};

                            await db.saveMessage(
                                conversation.id,
                                'INBOUND',
                                msg.type,
                                content,
                                'read',
                                msg.id
                            );
                            console.log(`Saved INBOUND message from ${phone}`);
                        }
                    }
                }
            }
        }

        // Return a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.sendStatus(500);
    }
});

// Get Webhook Logs (Frontend)
router.get('/logs', (req, res) => {
    res.json(webhookLogs);
});

module.exports = router;
