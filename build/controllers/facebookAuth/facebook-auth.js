"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookCallback = exports.facebookAuth = void 0;
const axios_1 = __importDefault(require("axios"));
require("express-session");
const REDIRECT_URI = "http://localhost:3030/auth/facebook/callback";
const facebookAuth = (request, response) => {
    const authUrl = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=email,public_profile,pages_messaging`;
    response.redirect(authUrl);
};
exports.facebookAuth = facebookAuth;
const facebookCallback = async (request, response) => {
    const facebookCode = request.query.code;
    if (!facebookCode) {
        return response.redirect('http://localhost:5173/failure');
    }
    try {
        const tokenResponse = await axios_1.default.get(`https://graph.facebook.com/v10.0/oauth/access_token`, {
            params: {
                client_id: process.env.FACEBOOK_APP_ID,
                redirect_uri: REDIRECT_URI,
                client_secret: process.env.FACEBOOK_APP_SECRET,
                code: facebookCode,
            },
        });
        const shortLivedAccessToken = tokenResponse.data.access_token;
        const longLivedTokenResponse = await axios_1.default.get(`https://graph.facebook.com/v10.0/oauth/access_token`, {
            params: {
                grant_type: 'fb_exchange_token',
                client_id: process.env.FACEBOOK_APP_ID,
                client_secret: process.env.FACEBOOK_APP_SECRET,
                fb_exchange_token: shortLivedAccessToken,
            },
        });
        const longLivedAccessToken = longLivedTokenResponse.data.access_token;
        const profileResponse = await axios_1.default.get(`https://graph.facebook.com/me`, {
            params: {
                access_token: longLivedAccessToken,
                fields: "id,last_name,email,first_name,gender,middle_name",
            },
        });
        const profile = profileResponse.data;
        request.session.user = profile;
        request.session.accessToken = longLivedAccessToken;
        response.redirect('http://localhost:3030/auth/instagram');
    }
    catch (error) {
        console.error(error.response.data);
        response.redirect('http://localhost:5173/failure');
    }
};
exports.facebookCallback = facebookCallback;
// prof {
//   id: '2113838078997567',
//   last_name: 'Kick',
//   email: 'smartkicks01@gmail.com', email
//   first_name: 'Smart',
//   install_type: 'UNKNOWN',
//   installed: true,
//   is_guest_user: false,
//   name: 'Smart Kick'
//instagram_graph_user_profile
// }user_messenger_contact
// &config_id=${2564397997087876}
