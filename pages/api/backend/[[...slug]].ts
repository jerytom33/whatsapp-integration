import type { VercelRequest, VercelResponse } from '@vercel/node';

module.exports = function handler(req: VercelRequest, res: VercelResponse) {
    // Dynamically require the Express app to avoid ESM issues
    const app = require('../../../backend/src/server');
    
    // Strip /api/backend prefix so Express sees the expected paths
    if (req.url?.startsWith('/api/backend')) {
        req.url = req.url.replace('/api/backend', '');
    }

    // Pass request to Express app
    app(req, res);
};
