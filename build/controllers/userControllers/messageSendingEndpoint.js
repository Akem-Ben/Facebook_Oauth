"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessagesEndpoint = void 0;
const sendMessages_1 = require("./sendMessages");
const app_1 = require("../../app");
const sendMessagesEndpoint = async (request, response) => {
    try {
        const usermessage = request.body.message;
        const userId = request.body.userId;
        const data = await (0, sendMessages_1.sendMessages)(usermessage, userId);
        if (data === 'error') {
            return response.status(400).json({ message: 'Error sending message' });
        }
        (0, app_1.emitMessage)(usermessage);
        return response.status(200).json({ message: 'Message sent successfully' });
    }
    catch (error) {
        console.log(error.response.data);
    }
};
exports.sendMessagesEndpoint = sendMessagesEndpoint;
