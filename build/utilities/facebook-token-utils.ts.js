"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshPageAccessToken = exports.getPageAccessToken = exports.getFacebookLonglivedToken = exports.getFacebookShortlivedToken = void 0;
const axios_1 = __importDefault(require("axios"));
const app_1 = require("../app");
const jwt_utils_1 = require("./jwt-utils");
const APP_ID = 'your_app_id';
const APP_SECRET = 'your_app_secret';
const PAGE_ID = 'your_page_id';
async function getFacebookShortlivedToken(code) {
    const response = await axios_1.default.get(`https://graph.facebook.com/v20.0/oauth/access_token`, {
        params: {
            client_id: process.env.FACEBOOK_APP_ID,
            redirect_uri: process.env.REDIRECT_URI,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            code: code,
        },
    });
    ;
    return response.data.access_token;
}
exports.getFacebookShortlivedToken = getFacebookShortlivedToken;
async function getFacebookLonglivedToken(shortLivedToken) {
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
exports.getFacebookLonglivedToken = getFacebookLonglivedToken;
async function getPageAccessToken(page_access_token) {
    const response = await axios_1.default.get(`https://graph.facebook.com/${PAGE_ID}`, {
        params: {
            fields: 'access_token',
            access_token: page_access_token
        }
    });
    return response.data.access_token;
}
exports.getPageAccessToken = getPageAccessToken;
async function refreshPageAccessToken() {
    // Retrieve the current token data from Supabase
    const { data, error } = await app_1.supabase
        .from('tokens')
        .select('token')
        .order('id', { ascending: false })
        .limit(1)
        .single();
    if (error) {
        console.error('Error fetching token:', error);
        return;
    }
    const tokenData = (0, jwt_utils_1.verifyToken)(data.token);
    if (!tokenData) {
        console.error('Invalid token data');
        return;
    }
    const currentUserAccessToken = tokenData.userAccessToken;
    try {
        // Get new long-lived user access token
        const newUserAccessToken = await getFacebookLonglivedToken(currentUserAccessToken);
        // Get new page access token
        const newPageAccessToken = await getPageAccessToken(newUserAccessToken);
        // Create JWT with new tokens
        const newToken = (0, jwt_utils_1.signToken)({ userAccessToken: newUserAccessToken, pageAccessToken: newPageAccessToken });
        // Store the signed JWT in Supabase
        await app_1.supabase.from('tokens').insert([{ token: newToken }]);
        console.log('Tokens refreshed and stored successfully');
    }
    catch (error) {
        console.error('Error refreshing tokens:', error);
    }
}
exports.refreshPageAccessToken = refreshPageAccessToken;
