const express = require('express');
const router = express.Router();
const aocService = require('../services/aocService');
const db = require('../services/db');

// Middleware to extract and validate API Key
const requireApiKey = (req, res, next) => {
    const apiKey = req.headers['x-aoc-api-key'];
    if (!apiKey) {
        return res.status(400).json({ error: 'Missing x-aoc-api-key header' });
    }
    req.aocApiKey = apiKey;
    next();
};

router.use(requireApiKey);

router.get('/templates', async (req, res) => {
    try {
        const data = await aocService.getTemplates(req.aocApiKey);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});

router.post('/templates', async (req, res) => {
    try {
        const data = await aocService.createTemplate(req.aocApiKey, req.body);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create template' });
    }
});

router.post('/send', async (req, res) => {
    try {
        const body = req.body;
        // Sanitize 'to' field (remove + and spaces), then ensure + prefix for AOC
        if (body.to) {
            let cleanTo = body.to.replace(/\D/g, '');
            body.to = `+${cleanTo}`;
        }

        // Ensure recipient_type is present
        if (!body.recipient_type) {
            body.recipient_type = 'individual';
        }

        // Remove invalid messaging_product
        delete body.messaging_product;

        // Inject Sender Number (Required by AOC)
        if (!body.from) {
            // Fallback to Env Var or hardcoded (User must configure)
            body.from = process.env.WHATSAPP_PHONE_NUMBER || '+918547475710';
        }

        console.log('Sending Payload to AOC:', JSON.stringify(body, null, 2));

        const data = await aocService.sendMessage(req.aocApiKey, body);

        // Save Outgoing Message
        // Use sanitized fields for DB (Consistent with Webhook)
        // Ensure we store it with '+' if that's the standard we want
        // If we want to align with previous 'from' field which had '+', let's keep it.
        const phone = body.to; // body.to already has '+' prepended above
        let preview = 'Media Message';
        let content = {};

        if (body.type === 'text') {
            preview = body.text.body;
            content = { body: body.text.body };
        } else if (body.type === 'template') {
            preview = `Template: ${body.template.name}`;
            content = body.template;
        } else if (body.type === 'interactive') {
            preview = 'Interactive Message';
            content = body.interactive;
        }

        const conversation = await db.upsertConversation(phone, phone, preview);
        await db.saveMessage(
            conversation.id,
            'OUTBOUND',
            body.type,
            content,
            'sent',
            data.messages?.[0]?.id // WAMID
        );

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Get All Chats
router.get('/chats', async (req, res) => {
    try {
        const chats = await db.getConversations();
        res.json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
});

// Get Chat Messages
router.get('/chats/:phone/messages', async (req, res) => {
    try {
        const messages = await db.getMessages(req.params.phone);
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

module.exports = router;
