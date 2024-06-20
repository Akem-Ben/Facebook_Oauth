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
        const converse = await (0, helperFunctions_1.fetchAdminConversationsIds)();
        if (!converse || converse.length === 0 || converse === undefined) {
            return response.status(404).json({
                message: "No conversations found.",
                data: [],
            });
        }
        const conversationDetails = await await Promise.all(converse.map(async (chat) => {
            const userChats = await axios_1.default.get(`${keys_1.FETCH_ADMIN_CONVERSATIONS_DETAILS_URI}/${chat.id}?fields=messages&access_token=${keys_1.MY_LONG_LIVED_ACCESS_TOKEN}`);
            return userChats.data.messages;
        }));
        const details = await Promise.all(conversationDetails.flat().map(async (msg) => {
            const users = await Promise.all(msg.data.map(async (info) => {
                const userMessage = await axios_1.default.get(`${keys_1.FETCH_ADMIN_CONVERSATIONS_DETAILS_URI}/${info.id}?fields=id,created_time,from,to,message&access_token=${keys_1.MY_LONG_LIVED_ACCESS_TOKEN}`);
                return userMessage.data;
            }));
            return users;
        }));
        const chatDetails = await Promise.all(details.map(async (text) => {
            const specifics = await Promise.all(text.map(async (messages) => {
                let userId = messages.from.id != keys_1.ADMIN_SCOPED_ID ? messages.from.id : null;
                return {
                    userId,
                    userName: messages.from.username,
                    message: messages.message,
                    date: (0, helperFunctions_1.formatDate)(messages.created_time),
                    time: (0, helperFunctions_1.formatTimeFromISO)(messages.created_time),
                };
            }));
            return specifics;
        }));
        // const conversations = await axios.get(FETCH_CONVERSATIONS_URL);
        // if (
        //   !conversations.data.messages.data ||
        //   conversations.data.messages.data.length === 0 ||
        //   conversations.data.messages.data === undefined
        // ) {
        //   return response.status(404).json({
        //     message: "No conversations found.",
        //     data: [],
        //   });
        // }
        // const messages = conversations.data.messages.data;
        // const detailsPromises = messages.map(async (msg: any) => {
        //   const user_message = await axios.get(
        //     `${GET_MESSAGES_URL}/${msg.id}?fields=id,created_time,from,to,message&access_token=${MY_LONG_LIVED_ACCESS_TOKEN}`
        //   );
        //   return {
        //     userName: user_message.data.from.username,
        //     userId: user_message.data.from.id,
        //     message: user_message.data.message,
        //     date: formatDate(user_message.data.created_time),
        //     time: formatTimeFromISO(user_message.data.created_time),
        //   };
        // });
        // const details = await Promise.all(detailsPromises);
        return response.status(200).json({ data: chatDetails });
    }
    catch (error) {
        console.log('fetch user conversation error', error.response ? error.response.data : error.message);
        return response.status(500).json({ message: 'error, contact admin' });
    }
};
exports.getConversations = getConversations;
