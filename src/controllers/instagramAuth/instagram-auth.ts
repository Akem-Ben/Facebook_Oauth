import { Request, Response } from 'express';
import axios from 'axios';

const REDIRECT_URI = "https://facebook-oauth-ihe6.onrender.com/auth/instagram/callback"
//"http://localhost:3030/auth/instagram/callback";

export const instagramAuth = async (request: Request, response: Response) => {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  response.redirect(authUrl);
};

export const instagramCallback = async (request: Request, response: Response) => {
  console.log('code recieved')
  const code = request.query.code as string;
  console.log('code is',code)

  if (!code) {
    return response.redirect('http://localhost:5173/failure');
  }

  try {
    const tokenResponse = await axios.post(
      `https://api.instagram.com/oauth/access_token`, null, {
        params: {
          client_id: process.env.INSTAGRAM_APP_ID as string,
          client_secret: process.env.INSTAGRAM_APP_SECRET as string,
          grant_type: 'authorization_code',
          redirect_uri: REDIRECT_URI,
          code,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const userId = tokenResponse.data.user_id;

    const profileResponse = await axios.get(`https://graph.instagram.com/${userId}`, {
      params: {
        access_token: accessToken,
        fields: "id,username,account_type,media_count",
      },
    });

    const profile = profileResponse.data;

    console.log('Instagram Profile:', profile);

    // Here you can save the profile and accessToken to your database or session

    response.redirect('https://beat-tech-blog.vercel.app/');
  } catch (error: any) {
    console.error('Instagram Auth Error:', error.message);
    response.redirect('http://localhost:5173/failure');
  }
};
