"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessages = void 0;
const axios_1 = __importDefault(require("axios"));
const sendMessages = async (usermessage, userId) => {
    try {
        const accessToken = process.env.MY_LONG_ACCESS_TOKEN;
        let body = {
            recipient: { id: userId },
            message: { text: usermessage }
        };
        console.log('body', body);
        console.log('token', accessToken);
        const response = await axios_1.default.post(`https://graph.instagram.com/v20.0/me/messages?access_token=${accessToken}`, body);
        console.log('response...', response.data);
        return response.data;
    }
    catch (error) {
        console.log(error.response);
    }
};
exports.sendMessages = sendMessages;
