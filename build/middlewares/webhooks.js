"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.verifyWebhook = void 0;
const sendMessages_1 = require("../controllers/userControllers/sendMessages");
const keys_1 = require("../keys");
const app_1 = require("../app");
// Webhook verification
const verifyWebhook = (request, response) => {
    const mode = request.query["hub.mode"];
    const token = request.query["hub.verify_token"];
    const challenge = request.query["hub.challenge"];
    if (mode && token) {
        if (mode === "subscribe" && token === keys_1.VERIFY_TOKEN) {
            response.status(200).send(challenge);
        }
        else {
            response.sendStatus(403);
        }
    }
    else {
        response.sendStatus(400);
    }
};
exports.verifyWebhook = verifyWebhook;
// Webhook endpoint to handle first time messages
const handleWebhook = async (request, response) => {
    try {
        const body = request.body;
        console.log(body);
        if (body.object === "instagram") {
            const promises = body.entry.map(async (entry) => {
                if (entry.messaging && entry.messaging.length > 0) {
                    const message = entry.messaging[0];
                    let checkUserId = message.sender.id;
                    if (checkUserId === keys_1.ADMIN_SCOPED_ID) {
                        return;
                    }
                    const { data: findScopedId, error: findScopedIdError } = await app_1.supabase
                        .from('users')
                        .select('*')
                        .eq('instagram_scoped_id', checkUserId)
                        .single();
                    if (findScopedId) {
                        return;
                    }
                    const setMessage = "Thank you for reaching out. We will get back to you soon.";
                    const recipientId = message.sender.id;
                    let user;
                    try {
                        return user = await (0, sendMessages_1.sendMessages)(setMessage, recipientId);
                    }
                    catch (sendError) {
                        console.error(`Error sending message to ${recipientId}:`, sendError.response ? sendError.response.data : sendError.message);
                    }
                }
            });
            await Promise.all(promises);
            return response.status(200).json({ message: "EVENT_RECEIVED" });
        }
        else {
            response.sendStatus(404);
        }
    }
    catch (error) {
        console.error("Webhook handling error:", error.response ? error.response.data : error.message);
        response.sendStatus(500);
    }
};
exports.handleWebhook = handleWebhook;
