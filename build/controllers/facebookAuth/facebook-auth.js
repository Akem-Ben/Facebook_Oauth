"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookCallback = exports.facebookAuth = void 0;
const axios_1 = __importDefault(require("axios"));
require("express-session");
const index_1 = require("../../keys/index");
const registerUserFacebook_1 = require("../userControllers/registerUserFacebook");
const facebookAuth = (request, response) => {
    const authUrl = `${index_1.FACEBOOK_AUTH_URL}?client_id=${index_1.USER_FACEBOOK_APP_ID}&redirect_uri=${index_1.FACEBOOK_AUTH_REDIRECT_URI}&scope=email,public_profile,instagram_basic`;
    response.redirect(authUrl);
};
exports.facebookAuth = facebookAuth;
const facebookCallback = async (request, response) => {
    const facebookCode = request.query.code;
    if (!facebookCode) {
        return response.redirect(index_1.ERROR_REDIRECT_URI);
    }
    try {
        const tokenResponse = await axios_1.default.get(index_1.FACEBOOK_TOKEN_URI, {
            params: {
                client_id: index_1.USER_FACEBOOK_APP_ID,
                redirect_uri: index_1.FACEBOOK_AUTH_REDIRECT_URI,
                client_secret: index_1.USER_FACEBOOK_APP_SECRET,
                code: facebookCode,
            },
        });
        const shortLivedAccessToken = tokenResponse.data.access_token;
        const longLivedTokenResponse = await axios_1.default.get(index_1.FACEBOOK_TOKEN_URI, {
            params: {
                grant_type: "fb_exchange_token",
                client_id: index_1.USER_FACEBOOK_APP_ID,
                client_secret: index_1.USER_FACEBOOK_APP_SECRET,
                fb_exchange_token: shortLivedAccessToken,
            },
        });
        const longLivedAccessToken = longLivedTokenResponse.data.access_token;
        const profileResponse = await axios_1.default.get(index_1.FACEBOOK_PROFILE_URI, {
            params: {
                access_token: longLivedAccessToken,
                fields: "id,last_name,email,first_name,gender,middle_name",
            },
        });
        const profile = profileResponse.data;
        const newUser = {
            facebook_id: profile.id,
            email: profile.email,
            first_name: profile.first_name,
            last_name: profile.last_name,
            facebook_access_token: longLivedAccessToken,
        };
        const user = await (0, registerUserFacebook_1.registerUserFacebook)(newUser);
        request.session.user = profile;
        request.session.accessToken = longLivedAccessToken;
        request.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
            }
            response.redirect(index_1.FACEBOOK_CALLBACK_REDIRECT);
        });
    }
    catch (error) {
        console.error('facebook callback error', error.response ? error.response.data : error.message);
        response.redirect(index_1.ERROR_REDIRECT_URI);
    }
};
exports.facebookCallback = facebookCallback;
