const express = require('express');
const router = express.Router();
const shopifyService = require('../services/shopifyService');

// Middleware to verify Shopify Webhook signature
// Note: req.body must be raw buffer here for verification to work
const verifyShopifyWebhook = async (req, res, next) => {
    const hmac = req.get('X-Shopify-Hmac-Sha256');
    if (!hmac || !req.rawBody) {
        return res.status(401).send('Unauthorized: Missing HMAC or body');
    }

    if (await shopifyService.verifyWebhook(req.rawBody, hmac)) {
        next();
    } else {
        console.error('Webhook verification failed');
        res.status(401).send('Unauthorized: Invalid signature');
    }
};

// Start of webhook routes
router.post('/webhooks/orders/create', verifyShopifyWebhook, async (req, res) => {
    try {
        // req.body is likely a Buffer here because of the raw parser in app.js
        // We need to parse it to JSON manually if it hasn't been parsed yet
        const payload = JSON.parse(req.rawBody.toString());
        await shopifyService.handleOrderCreated(payload);
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error processing order create webhook:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/webhooks/fulfillments/update', verifyShopifyWebhook, async (req, res) => {
    try {
        const payload = JSON.parse(req.rawBody.toString());
        await shopifyService.handleFulfillmentUpdate(payload);
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error processing fulfillment webhook:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET /api/shopify/products
router.get('/products', async (req, res) => {
    try {
        const products = await shopifyService.getProducts();
        res.json(products);
    } catch (error) {
        console.error('Error in /products route:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
