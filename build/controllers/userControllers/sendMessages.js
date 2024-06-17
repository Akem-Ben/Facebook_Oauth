"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessages = void 0;
const axios_1 = __importDefault(require("axios"));
const sendMessages = async (message, userId, accessToken) => {
    try {
        const response = await axios_1.default.post(`https://graph.instagram.com/v20.0/me/messages`, {
            recipient: { id: userId },
            message: { text: message }
        }, { params: { access_token: accessToken } });
        console.log('response...', response.data);
        return response.data;
    }
    catch (error) {
        console.log(error.response);
    }
};
exports.sendMessages = sendMessages;
