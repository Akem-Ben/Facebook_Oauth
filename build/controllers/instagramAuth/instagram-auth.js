"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instagramCallback = exports.instagramAuth = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const qs_1 = __importDefault(require("qs"));
dotenv_1.default.config();
let user;
const REDIRECT_URI = "https://facebook-oauth-ihe6.onrender.com/auth/instagram/callback";
//"http://localhost:3030/auth/instagram/callback";
const instagramAuth = async (request, response) => {
    const user = request.session.facebookProfile;
    const newUser = JSON.stringify(user);
    console.log('user is', user);
    console.log('newUser is', newUser);
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    response.redirect(authUrl);
};
exports.instagramAuth = instagramAuth;
const instagramCallback = async (request, response) => {
    console.log('Session in instagramCallback:', request.session);
    const id = request.query.profile;
    console.log('id is', id);
    console.log('querry', request.query);
    const instagramCode = request.query.code;
    if (!instagramCode) {
        return response.redirect("http://localhost:5173/failure");
    }
    try {
        const tokenResponse = await axios_1.default.post("https://api.instagram.com/oauth/access_token", qs_1.default.stringify({
            client_id: process.env.INSTAGRAM_APP_ID,
            client_secret: process.env.INSTAGRAM_APP_SECRET,
            grant_type: "authorization_code",
            redirect_uri: REDIRECT_URI,
            code: instagramCode,
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const shortLivedAccessToken = tokenResponse.data.access_token;
        const instegramUserId = tokenResponse.data.user_id;
        const longLivedTokenResponse = await axios_1.default.get(`https://graph.instagram.com/access_token`, {
            params: {
                grant_type: "ig_exchange_token",
                client_secret: process.env.INSTAGRAM_APP_SECRET,
                access_token: shortLivedAccessToken,
            },
        });
        const longLivedAccessToken = longLivedTokenResponse.data.access_token;
        const profileResponse = await axios_1.default.get(`https://graph.instagram.com/${instegramUserId}`, {
            params: {
                access_token: longLivedAccessToken,
                fields: "id,username,account_type,media_count",
            },
        });
        const instagramProfile = profileResponse.data;
        response.redirect("https://beat-tech-blog.vercel.app/");
    }
    catch (error) {
        console.error("Instagram Auth Error:", error.response.data);
        response.redirect("http://localhost:5173/failure");
    }
};
exports.instagramCallback = instagramCallback;
