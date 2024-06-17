"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instagramCallback = exports.instagramAuth = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const keys_1 = require("../../keys");
const instagramAuth = async (request, response) => {
    const authUrl = `${keys_1.INSTAGRAM_AUTH_URL}?client_id=${keys_1.USER_INSTAGRAM_APP_ID}&redirect_uri=${keys_1.INSTAGRAM_AUTH_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    response.cookie("user", request.session.user);
    request.session.save(() => {
        response.redirect(authUrl);
    });
};
exports.instagramAuth = instagramAuth;
const instagramCallback = async (request, response) => {
    try {
        console.log("Session in instagramCallback:", request.session);
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
        console.log('user', instagramProfile);
        // try {
        //   await axios.post(
        //     `https:///graph.facebook.com/v20.0/me/messages?access_token=${longLivedAccessToken}`,
        //     {
        //       recipient: { id: instagramProfile.id },
        //       message: { text: "Welcome to our app!" }
        //     }
        //   );
        // } catch (error: any) {
        //   console.error("Error sending default message:", error.response.data);
        // }
        response.redirect(keys_1.ADMIN_INSTAGRAM_PROFILE_URI);
    }
    catch (error) {
        console.error("Instagram Auth Error:", error.response.data);
        response.redirect(keys_1.ERROR_REDIRECT_URI);
    }
};
exports.instagramCallback = instagramCallback;
