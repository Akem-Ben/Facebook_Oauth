"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookCallback = exports.facebookAuth = void 0;
const axios_1 = __importDefault(require("axios"));
require("express-session");
const store_1 = require("../../middlewares/store");
const REDIRECT_URI = "http://localhost:3030/auth/facebook/callback";
const facebookAuth = (request, response) => {
    const authUrl = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=email,public_profile`;
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
                fields: "id,last_name,email,about,age_range,avatar_2d_profile_picture,birthday,education,favorite_athletes,favorite_teams,first_name,hometown,gender,id_for_avatars,inspirational_people,install_type,installed,is_guest_user,languages,link,location,middle_name,name,photos",
            },
        });
        const profile = profileResponse.data;
        request.session.facebookProfile = profile;
        request.session.accessToken = longLivedAccessToken;
        (0, store_1.setTempStorage)(request.sessionID, profile);
        request.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return response.redirect('http://localhost:5173/failure');
            }
            response.redirect('http://localhost:3030/auth/instagram');
        });
    }
    catch (error) {
        console.error(error.message);
        response.redirect('/failure');
    }
};
exports.facebookCallback = facebookCallback;
// prof {
//   id: '2113838078997567',
//   last_name: 'Kick',
//   email: 'smartkicks01@gmail.com',
//   first_name: 'Smart',
//   install_type: 'UNKNOWN',
//   installed: true,
//   is_guest_user: false,
//   name: 'Smart Kick'
// }
// &config_id=${2564397997087876}
