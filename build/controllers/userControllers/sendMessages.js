"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessages = void 0;
const axios_1 = __importDefault(require("axios"));
const keys_1 = require("../../keys");
const app_1 = require("../../app");
const sendMessages = async (usermessage, userId) => {
    try {
        const accessToken = keys_1.MY_LONG_LIVED_ACCESS_TOKEN;
        let body = {
            platform: "instagram",
            recipient: { id: userId },
            message: { text: usermessage }
        };
        const response = await axios_1.default.post(`${keys_1.MESSAGE_SENDING_URL}?access_token=${accessToken}`, JSON.stringify(body), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 200) {
            (0, app_1.emitMessage)('error');
            return 'error';
        }
        else {
            (0, app_1.emitMessage)(usermessage);
            return 'success';
        }
    }
    catch (error) {
        console.log(error.response.data);
    }
};
exports.sendMessages = sendMessages;
