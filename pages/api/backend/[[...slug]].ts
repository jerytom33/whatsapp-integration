import type { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore
import app from '../../../backend/src/server';

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Strip /api/backend prefix so Express sees the expected paths
    if (req.url?.startsWith('/api/backend')) {
        req.url = req.url.replace('/api/backend', '');
    }

    // Pass request to Express app
    app(req, res);
}
