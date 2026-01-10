const crypto = require('crypto');
const axios = require('axios');
const aocService = require('./aocService');

const db = require('./db');

/**
 * Verifies the Shopify webhook HMAC signature.
 * @param {Buffer} rawBody - The raw body of the request.
 * @param {string} hmacHeader - The X-Shopify-Hmac-Sha256 header.
 * @returns {Promise<boolean>} - True if signature is valid.
 */
const verifyWebhook = async (rawBody, hmacHeader) => {
    const shopifySecret = await db.getSetting('SHOPIFY_WEBHOOK_SECRET');
    if (!shopifySecret) {
        console.error('SHOPIFY_WEBHOOK_SECRET is not set in DB');
        return false;
    }
    const generatedHash = crypto
        .createHmac('sha256', shopifySecret)
        .update(rawBody)
        .digest('base64');

    // safe compare to prevent timing attacks
    try {
        return crypto.timingSafeEqual(
            Buffer.from(generatedHash),
            Buffer.from(hmacHeader)
        );
    } catch (e) {
        console.error('Error verifying webhook signature:', e);
        return false;
    }
};

/**
 * Handles 'orders/create' webhook.
 * @param {Object} payload - The order payload.
 */
const handleOrderCreated = async (payload) => {
    console.log(`Processing Order Created: ${payload.id} for customer ${payload.email}`);

    // Extract phone number - normalize to E.164 if possible
    let phone = payload.customer?.phone || payload.shipping_address?.phone || payload.billing_address?.phone;

    if (phone) {
        // Basic normalization logic - remove non-digits
        phone = phone.replace(/[^\d+]/g, '');
        console.log(`Found phone number: ${phone}`);

        try {
            // Trigger WhatsApp template
            // Using aocService to send message
            const apiKey = process.env.AOC_PORTAL_API_KEY;

            // Construct the message payload expected by AOC Portal
            // This structure might need adjustment based on AOC API docs, but assuming standard structure
            const messageData = {
                to: phone,
                type: 'template',
                template: {
                    name: 'order_confirmation',
                    language: {
                        code: 'en'
                    },
                    components: [
                        {
                            type: 'body',
                            parameters: [
                                {
                                    type: 'text',
                                    text: payload.order_number.toString()
                                }
                            ]
                        }
                    ]
                }
            };

            console.log(`Sending WhatsApp message to ${phone} for Order #${payload.order_number}`);
            await aocService.sendMessage(apiKey, messageData);

        } catch (error) {
            console.error('Failed to send WhatsApp notification:', error);
        }
    } else {
        console.log('No phone number found for order');
    }
};

/**
 * Handles 'fulfillments/update' webhook.
 */
const handleFulfillmentUpdate = async (payload) => {
    console.log(`Processing Fulfillment Update: ${payload.id} status: ${payload.status}`);
    // Logic for shipping updates would go here
};



/**
 * Fetches products from Shopify store.
 * @returns {Promise<Array>} List of products.
 */
const getProducts = async () => {
    const shopDomain = await db.getSetting('SHOPIFY_SHOP_DOMAIN');
    const accessToken = await db.getSetting('SHOPIFY_ACCESS_TOKEN');

    if (!shopDomain || !accessToken) {
        throw new Error('Shopify credentials not configured');
    }

    const url = `https://${shopDomain}/admin/api/2024-01/products.json`;

    try {
        const response = await axios.get(url, {
            headers: {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json'
            }
        });
        return response.data.products;
    } catch (error) {
        console.error('Error fetching Shopify products:', error.response?.data || error.message);
        throw new Error('Failed to fetch products from Shopify');
    }
};

module.exports = {
    verifyWebhook,
    handleOrderCreated,
    handleFulfillmentUpdate,
    getProducts
};
