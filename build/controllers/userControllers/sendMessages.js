"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessages = void 0;
const axios_1 = __importDefault(require("axios"));
const sendMessages = async (request, response) => {
    const { message, userId, accessToken } = request.body;
    //   let users;
    //   if (userId) {
    //     users = [{ id: userId }];
    //   } else {
    //     const { data, error } = await supabase.from('instagram_users').select('id');
    //     if (error) {
    //       return response.status(500).send('Error fetching users');
    //     }
    //     users = data;
    //   }
    try {
        await axios_1.default.post(`https://graph.instagram.com/me/messages`, {
            recipient: { id: userId },
            message: { text: message }
        }, { params: { access_token: accessToken } });
    }
    catch (error) {
        console.error(`Error sending message to user ${userId}:`, error.response.data);
    }
    response.status(200).send('Messages sent');
};
exports.sendMessages = sendMessages;
