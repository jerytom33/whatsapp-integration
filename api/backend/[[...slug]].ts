import type { VercelRequest, VercelResponse } from '@vercel/node';
// @ts-ignore
import app from '../../backend/src/server';

export default function handler(req: VercelRequest, res: VercelResponse) {
    // Strip /api/backend prefix so Express sees the expected paths
    if (req.url?.startsWith('/api/backend')) {
        req.url = req.url.replace('/api/backend', '');
    }

    // Pass request to Express app
    app(req, res);
}
