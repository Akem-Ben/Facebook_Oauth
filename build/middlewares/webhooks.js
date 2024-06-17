"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.verifyWebhook = void 0;
const sendMessages_1 = require("../controllers/userControllers/sendMessages");
// Webhook verification
const verifyWebhook = (request, response) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    const mode = request.query["hub.mode"];
    const token = request.query["hub.verify_token"];
    const challenge = request.query["hub.challenge"];
    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
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
// Webhook endpoint to handle messages
const handleWebhook = async (request, response) => {
    try {
        const body = request.body;
        console.log('body', body);
        const newBody = body.entry[0].messaging[0];
        const recipientId = newBody.sender.id;
        const messageToSend = "Thank you for reaching out. We will get back to you soon.";
        console.log('messaging to', newBody);
        // if (body.object === "instagram") {
        //   const promises = body.entry.map(async (entry: any) => {
        //     if (entry.messaging && entry.messaging.length > 0) {
        //       const message = entry.messaging[0];
        //       console.log("Message received:", message);
        //       const setMessage = "Thank you for reaching out. We will get back to you soon.";
        //       const recipientId = message.sender.id;
        //       }
        //       });
        //       await Promise.all(promises);
        //       response.status(200).send("EVENT_RECEIVED");
        //       } else {
        //         response.sendStatus(404);
        //         }
        try {
            console.log(`Message sending to ${recipientId}`);
            await (0, sendMessages_1.sendMessages)(messageToSend, recipientId);
        }
        catch (sendError) {
            console.error(`Error sending message to ${recipientId}:`, sendError.response ? sendError.response.data : sendError.message);
        }
    }
    catch (error) {
        console.error("Webhook handling error:", error.response ? error.response.data : error.message);
        response.sendStatus(500);
    }
};
exports.handleWebhook = handleWebhook;
