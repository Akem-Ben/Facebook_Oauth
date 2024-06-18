"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversations = void 0;
const axios_1 = __importDefault(require("axios"));
const keys_1 = require("../../keys");
const helperFunctions_1 = require("../../utilities/helperFunctions");
const getConversations = async (request, response) => {
    try {
        const conversations = await axios_1.default.get(keys_1.FETCH_CONVERSATIONS_URL);
        console.log('con', conversations);
        if (!conversations.data.messages.data ||
            conversations.data.messages.data.length === 0 ||
            conversations.data.messages.data === undefined) {
            return response.status(404).json({
                message: "No conversations found.",
                data: [],
            });
        }
        const messages = conversations.data.messages.data;
        const detailsPromises = messages.map(async (msg) => {
            const user_message = await axios_1.default.get(`${keys_1.GET_MESSAGES_URL}/${msg.id}?fields=id,created_time,from,to,message&access_token=${keys_1.MY_LONG_LIVED_ACCESS_TOKEN}`);
            return {
                userName: user_message.data.from.username,
                userId: user_message.data.from.id,
                message: user_message.data.message,
                date: (0, helperFunctions_1.formatDate)(user_message.data.created_time),
                time: (0, helperFunctions_1.formatTimeFromISO)(user_message.data.created_time),
            };
        });
        const details = await Promise.all(detailsPromises);
        return response.status(200).json({ data: details });
    }
    catch (error) {
        console.log('fetch user conversation error', error.response ? error.response.data : error.message);
        return response.status(500).json({ message: 'error, contact admin' });
    }
};
exports.getConversations = getConversations;
