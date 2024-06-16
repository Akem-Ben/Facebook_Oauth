"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.verifyWebhook = void 0;
// Webhook verification
const verifyWebhook = (request, response) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    const mode = request.query['hub.mode'];
    const token = request.query['hub.verify_token'];
    const challenge = request.query['hub.challenge'];
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            response.status(200).send(challenge);
        }
        else {
            response.sendStatus(403);
        }
    }
};
exports.verifyWebhook = verifyWebhook;
// Webhook endpoint to handle messages
const handleWebhook = (request, response) => {
    try {
        const body = request.body;
        if (body.object === 'instagram') {
            body.entry.forEach((entry) => {
                const message = entry.messaging[0];
                console.log('Message received:', message);
                // Handle message event here
            });
            response.status(200).send('EVENT_RECEIVED');
        }
        else {
            response.sendStatus(404);
        }
    }
    catch (error) {
        console.error(error.response);
        response.sendStatus(500);
    }
};
exports.handleWebhook = handleWebhook;
