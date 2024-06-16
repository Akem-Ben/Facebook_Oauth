"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessages = void 0;
const app_1 = require("../../app"); // Assuming supabase is initialized in app.ts
const axios_1 = __importDefault(require("axios"));
const sendMessages = async (req, res) => {
    const { message, userId } = req.body;
    let users;
    if (userId) {
        users = [{ id: userId }];
    }
    else {
        const { data, error } = await app_1.supabase.from('instagram_users').select('id');
        if (error) {
            return res.status(500).send('Error fetching users');
        }
        users = data;
    }
    const accessToken = "your-instagram-access-token"; // Replace with actual token
    users.forEach(async (user) => {
        try {
            await axios_1.default.post(`https://graph.instagram.com/me/messages`, {
                recipient: { id: user.id },
                message: { text: message }
            }, { params: { access_token: accessToken } });
        }
        catch (error) {
            console.error(`Error sending message to user ${user.id}:`, error.response.data);
        }
    });
    res.status(200).send('Messages sent');
};
exports.sendMessages = sendMessages;
