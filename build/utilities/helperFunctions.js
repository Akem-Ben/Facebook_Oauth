"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAdminConversationsIds = exports.isClient = exports.formatDate = exports.formatTimeFromISO = void 0;
const axios_1 = __importDefault(require("axios"));
const keys_1 = require("../keys");
function formatTimeFromISO(isoString) {
    // Parse the ISO string to a Date object
    const date = new Date(isoString);
    // Extract hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    // Format minutes to always have two digits
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    // Combine into final formatted string
    const formattedTime = `${hours}:${minutesStr}${ampm}`;
    return formattedTime;
}
exports.formatTimeFromISO = formatTimeFromISO;
const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};
exports.formatDate = formatDate;
const isClient = () => {
    return typeof window !== 'undefined' && 'localStorage' in window;
};
exports.isClient = isClient;
const fetchAdminConversationsIds = async () => {
    try {
        const getData = await axios_1.default.get(`${keys_1.FETCH_ADMIN_CONVERSATIONS_DETAILS_URI}/${keys_1.ADMIN_FACEBOOK_PAGE_ID}/conversations?platform=instagram&access_token=${keys_1.MY_LONG_LIVED_ACCESS_TOKEN}`);
        const conversations = getData.data.data;
        return conversations;
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.fetchAdminConversationsIds = fetchAdminConversationsIds;
