"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instagramCallback = exports.instagramAuth = void 0;
const axios_1 = __importDefault(require("axios"));
const REDIRECT_URI = "https://facebook-oauth-ihe6.onrender.com/auth/instagram/callback";
//"http://localhost:3030/auth/instagram/callback";
const instagramAuth = async (request, response) => {
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    response.redirect(authUrl);
};
exports.instagramAuth = instagramAuth;
const instagramCallback = async (request, response) => {
    const code = request.query.code;
    if (!code) {
        return response.redirect('http://localhost:5173/failure');
    }
    try {
        const tokenResponse = await axios_1.default.post(`https://api.instagram.com/oauth/access_token?client_id=${process.env.INSTAGRAM_APP_ID}&client_secret=${process.env.INSTAGRAM_APP_SECRET}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}&code=${code}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log('toks', tokenResponse);
        const accessToken = tokenResponse.data.access_token;
        const userId = tokenResponse.data.user_id;
        const profileResponse = await axios_1.default.get(`https://graph.instagram.com/${userId}`, {
            params: {
                access_token: accessToken,
                fields: "id,username,account_type,media_count",
            },
        });
        const profile = profileResponse.data;
        console.log('Instagram Profile:', profile);
        // Here you can save the profile and accessToken to your database or session
        response.redirect('https://beat-tech-blog.vercel.app/');
    }
    catch (error) {
        console.error('Instagram Auth Error:', error);
        response.redirect('http://localhost:5173/failure');
    }
};
exports.instagramCallback = instagramCallback;
// import { Request, Response } from 'express';
// import axios from 'axios';
// const REDIRECT_URI = process.env.REDIRECT_URI || "https://your-render-app.onrender.com/auth/instagram/callback";
// export const instagramAuth = async (request: Request, response: Response) => {
//   const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
//   response.redirect(authUrl);
// };
// export const instagramCallback = async (request: Request, response: Response) => {
//   const code = request.query.code as string;
//   if (!code) {
//     return response.redirect('http://localhost:5173/failure');
//   }
//   try {
//     // Exchange code for short-lived access token
//     const tokenResponse = await axios.post(
//       `https://api.instagram.com/oauth/access_token`, null, {
//         params: {
//           client_id: process.env.INSTAGRAM_APP_ID as string,
//           client_secret: process.env.INSTAGRAM_APP_SECRET as string,
//           grant_type: 'authorization_code',
//           redirect_uri: REDIRECT_URI,
//           code,
//         },
//       }
//     );
//     const shortLivedAccessToken = tokenResponse.data.access_token;
//     const userId = tokenResponse.data.user_id;
//     // Exchange short-lived access token for long-lived access token
//     const longLivedTokenResponse = await axios.get(
//       `https://graph.instagram.com/access_token`, {
//         params: {
//           grant_type: 'ig_exchange_token',
//           client_secret: process.env.INSTAGRAM_APP_SECRET as string,
//           access_token: shortLivedAccessToken,
//         },
//       }
//     );
//     const longLivedAccessToken = longLivedTokenResponse.data.access_token;
//     // Fetch user profile using long-lived access token
//     const profileResponse = await axios.get(`https://graph.instagram.com/${userId}`, {
//       params: {
//         access_token: longLivedAccessToken,
//         fields: "id,username,account_type,media_count",
//       },
//     });
//     const profile = profileResponse.data;
//     console.log('Instagram Profile:', profile);
//     // Here you can save the profile and accessToken to your database or session
//     response.redirect('https://your-frontend-app.com/profile');
//   } catch (error: any) {
//     console.error('Instagram Auth Error:', error.response ? error.response.data : error.message);
//     response.redirect('http://localhost:5173/failure');
//   }
// };
