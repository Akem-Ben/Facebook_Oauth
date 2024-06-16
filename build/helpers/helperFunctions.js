"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const supabaseClient_1 = require("./supabaseClient");
const hashToken_1 = require("./hashToken");
const APP_ID = 'your_app_id';
const APP_SECRET = 'your_app_secret';
const PAGE_ID = 'your_page_id';
async function getLongLivedToken(shortLivedToken) {
    const response = await axios_1.default.get('https://graph.facebook.com/oauth/access_token', {
        params: {
            grant_type: 'fb_exchange_token',
            client_id: APP_ID,
            client_secret: APP_SECRET,
            fb_exchange_token: shortLivedToken
        }
    });
    return response.data.access_token;
}
async function getPageAccessToken(userAccessToken) {
    const response = await axios_1.default.get(`https://graph.facebook.com/${PAGE_ID}`, {
        params: {
            fields: 'access_token',
            access_token: userAccessToken
        }
    });
    return response.data.access_token;
}
async function refreshPageAccessToken() {
    // Retrieve current long-lived user access token from the Supabase database
    const { data, error } = await supabaseClient_1.supabase
        .from('tokens')
        .select('user_access_token')
        .order('id', { ascending: false })
        .limit(1)
        .single();
    if (error) {
        console.error('Error fetching token:', error);
        return;
    }
    const currentUserAccessToken = data.user_access_token;
    try {
        // Get new long-lived user access token
        const newUserAccessToken = await getLongLivedToken(currentUserAccessToken);
        // Get new page access token
        const newPageAccessToken = await getPageAccessToken(newUserAccessToken);
        // Hash the tokens before storing them
        const hashedUserAccessToken = (0, hashToken_1.hashToken)(newUserAccessToken);
        const hashedPageAccessToken = (0, hashToken_1.hashToken)(newPageAccessToken);
        // Update the tokens in your Supabase database
        await supabaseClient_1.supabase.from('tokens').insert([
            { user_access_token: hashedUserAccessToken, page_access_token: hashedPageAccessToken }
        ]);
        console.log('Tokens refreshed and stored successfully');
    }
    catch (error) {
        console.error('Error refreshing tokens:', error);
    }
}
// Schedule this function to run periodically
// e.g., using a background scheduler like node-cron, etc.
