import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import qs from 'qs';

dotenv.config();


const REDIRECT_URI = "https://facebook-oauth-ihe6.onrender.com/auth/instagram/callback"
//"http://localhost:3030/auth/instagram/callback";

export const instagramAuth = async (request: Request, response: Response) => {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  response.redirect(authUrl);
};

export const instagramCallback = async (request: Request, response: Response) => {

  const code = request.query.code as string;

  if (!code) {
    return response.redirect('http://localhost:5173/failure');
  }

  try {
    const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', qs.stringify({
      client_id: process.env.INSTAGRAM_APP_ID,
      client_secret: process.env.INSTAGRAM_APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      code: code,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log('toks',tokenResponse)

    const shortLivedAccessToken = tokenResponse.data.access_token;
        const userId = tokenResponse.data.user_id;


        const longLivedTokenResponse = await axios.get(
      `https://graph.instagram.com/access_token`, {
        params: {
          grant_type: 'ig_exchange_token',
          client_secret: process.env.INSTAGRAM_APP_SECRET as string,
          access_token: shortLivedAccessToken,
        },
      }
    );

    const longLivedAccessToken = longLivedTokenResponse.data.access_token;

    const profileResponse = await axios.get(`https://graph.instagram.com/${userId}`, {
      params: {
        access_token: longLivedAccessToken,
        fields: "id,username,account_type,media_count",
      },
    });

    const profile = profileResponse.data;

    console.log('Instagram Profile:', profile);

    // Here you can save the profile and accessToken to your database or session

    response.redirect('https://beat-tech-blog.vercel.app/');
  } catch (error: any) {
    console.error('Instagram Auth Error:', error.response.data);
    response.redirect('http://localhost:5173/failure');
  }
};