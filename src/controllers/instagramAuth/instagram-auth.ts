import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import qs from "qs";

const REDIRECT_URI = "https://facebook-oauth-ihe6.onrender.com/auth/instagram/callback";
//"http://localhost:3030/auth/instagram/callback";

export const instagramAuth = async (request: Request, response: Response) => {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.USER_INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  response.cookie('user', request.session.user)
  request.session.save(() => {
    response.redirect(authUrl);
  });
};

export const instagramCallback = async (
  request: Request,
  response: Response
) => {
  try {
  console.log('Session in instagramCallback:', request.session); 

  const instagramCode = request.query.code as string;

  if (!instagramCode) {
    console.log('yeah')
    return response.redirect("http://localhost:5173/failure");
  }

  console.log('no')
    const tokenResponse = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      qs.stringify({
        client_id: process.env.USER_INSTAGRAM_APP_ID,
        client_secret: process.env.USER_INSTAGRAM_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
        code: instagramCode,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log('oops')

    const shortLivedAccessToken = tokenResponse.data.access_token;

    const instegramUserId = tokenResponse.data.user_id;

    const longLivedTokenResponse = await axios.get(`https://graph.instagram.com/access_token`,
      {
        params: {
          grant_type: "ig_exchange_token",
          client_secret: process.env.USER_INSTAGRAM_APP_SECRET as string,
          access_token: shortLivedAccessToken,
        },
      }
    );

    console.log('oopsie')


    const longLivedAccessToken = longLivedTokenResponse.data.access_token;

    const profileResponse = await axios.get(`https://graph.instagram.com/${instegramUserId}`,
      {
        params: {
          access_token: longLivedAccessToken,
          fields: "id,username,account_type,media_count",
        },
      }
    );

    const instagramProfile = profileResponse.data;
    
    console.log('page', longLivedAccessToken)
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

    response.redirect("https://ig.me/m/_akemini_");
  } catch (error: any) {
    console.error("Instagram Auth Error:", error.response.data);
    response.redirect("http://localhost:5173/failure");
  }
};
