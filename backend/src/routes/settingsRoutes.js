const express = require('express');
const router = express.Router();
const db = require('../services/db');

// GET /api/settings/shopify
router.get('/shopify', async (req, res) => {
    try {
        const shopDomain = await db.getSetting('SHOPIFY_SHOP_DOMAIN');
        const accessToken = await db.getSetting('SHOPIFY_ACCESS_TOKEN');
        const webhookSecret = await db.getSetting('SHOPIFY_WEBHOOK_SECRET');

        res.json({
            shopDomain: shopDomain || '',
            accessToken: accessToken ? '********' : '', // Mask for security
            webhookSecret: webhookSecret ? '********' : '', // Mask for security
            isConfigured: !!(shopDomain && accessToken && webhookSecret)
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST /api/settings/shopify
router.post('/shopify', async (req, res) => {
    const { shopDomain, accessToken, webhookSecret } = req.body;

    try {
        if (shopDomain) await db.upsertSetting('SHOPIFY_SHOP_DOMAIN', shopDomain);
        if (accessToken) await db.upsertSetting('SHOPIFY_ACCESS_TOKEN', accessToken);
        if (webhookSecret) await db.upsertSetting('SHOPIFY_WEBHOOK_SECRET', webhookSecret);

        res.json({ success: true, message: 'Settings saved successfully' });
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
