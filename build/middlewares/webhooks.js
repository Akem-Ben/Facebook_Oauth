"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.verifyWebhook = void 0;
const axios_1 = __importDefault(require("axios"));
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
};
exports.verifyWebhook = verifyWebhook;
// Webhook endpoint to handle messages
const handleWebhook = async (request, response) => {
    try {
        const body = request.body;
        if (body.object === "instagram") {
            body.entry.forEach(async (entry) => {
                const message = entry.messaging[0];
                console.log("Message received:", message);
                const setMessage = "Thank you for reaching out. We will get back to you soon.";
                const recipientId = message.sender.id;
                const accessToken = process.env.MY_LONG_ACCESS_TOKEN;
                const body = {
                    message: setMessage,
                    userId: recipientId,
                    accessToken,
                };
                const check = await axios_1.default.post("http://localhost:3030/send-message", body);
                console.log("check", check.data);
            });
            response.status(200).send("EVENT_RECEIVED");
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
