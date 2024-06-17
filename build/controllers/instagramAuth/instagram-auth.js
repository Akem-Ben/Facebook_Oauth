"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instagramCallback = exports.instagramAuth = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const keys_1 = require("../../keys");
const registerUserInstagram_1 = require("./registerUserInstagram");
const helperFunctions_1 = require("../../utilities/helperFunctions");
const instagramAuth = async (request, response) => {
    const facebookUser = request.session.user;
    if ((0, helperFunctions_1.isClient)()) {
        localStorage.setItem('userFacebookDetails', JSON.stringify(facebookUser));
    }
    console.log('facebook user', facebookUser);
    const authUrl = `${keys_1.INSTAGRAM_AUTH_URL}?client_id=${keys_1.USER_INSTAGRAM_APP_ID}&redirect_uri=${keys_1.INSTAGRAM_AUTH_REDIRECT_URI}&scope=user_profile,user_media&response_type=code&facebook_user=${encodeURIComponent(JSON.stringify(facebookUser))}`;
    response.redirect(authUrl);
};
exports.instagramAuth = instagramAuth;
const instagramCallback = async (request, response) => {
    try {
        if ((0, helperFunctions_1.isClient)()) {
            const facebook_details = localStorage.getItem('userFacebookDetails');
            console.log('facebook details', JSON.parse(facebook_details));
        }
        const instagramCode = request.query.code;
        if (!instagramCode) {
            return response.redirect(keys_1.ERROR_REDIRECT_URI);
        }
        const tokenResponse = await axios_1.default.post(keys_1.INSTAGRAM_SHORT_LIVED_ACCESS_TOKEN_URI, qs_1.default.stringify({
            client_id: keys_1.USER_INSTAGRAM_APP_ID,
            client_secret: keys_1.USER_INSTAGRAM_APP_SECRET,
            grant_type: "authorization_code",
            redirect_uri: keys_1.INSTAGRAM_AUTH_REDIRECT_URI,
            code: instagramCode,
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const shortLivedAccessToken = tokenResponse.data.access_token;
        const instegramUserId = tokenResponse.data.user_id;
        const longLivedTokenResponse = await axios_1.default.get(keys_1.INSTAGRAM_LONG_LIVED_ACCESS_TOKEN_URI, {
            params: {
                grant_type: "ig_exchange_token",
                client_secret: keys_1.USER_INSTAGRAM_APP_SECRET,
                access_token: shortLivedAccessToken,
            },
        });
        const longLivedAccessToken = longLivedTokenResponse.data.access_token;
        const profileResponse = await axios_1.default.get(`${keys_1.INSTAGRAM_PROFILE_URI}/${instegramUserId}`, {
            params: {
                access_token: longLivedAccessToken,
                fields: "id,username,account_type,media_count",
            },
        });
        const instagramProfile = profileResponse.data;
        const facebookUser = process.env.FACEBOOK_ID;
        console.log('facebook user', facebookUser);
        const profile = {
            instagram_id: instagramProfile.id,
            instagram_user_name: instagramProfile.username,
            instagram_account_type: instagramProfile.account_type,
            instagram_media_count: instagramProfile.media_count,
            instagram_access_token: longLivedAccessToken
        };
        await (0, registerUserInstagram_1.registerUserInstagram)(profile);
        response.redirect(keys_1.ADMIN_INSTAGRAM_PROFILE_URI);
    }
    catch (error) {
        console.error("Instagram Auth Error:", error.response ? error.response.data : error.message);
        response.redirect(keys_1.ERROR_REDIRECT_URI);
    }
};
exports.instagramCallback = instagramCallback;
