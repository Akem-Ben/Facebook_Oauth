import { Request, Response } from "express";
import axios from "axios";
import "express-session";
import {
  ERROR_REDIRECT_URI,
  FACEBOOK_AUTH_URL,
  FACEBOOK_AUTH_REDIRECT_URI,
  FACEBOOK_TOKEN_URI,
  FACEBOOK_PROFILE_URI,
  FACEBOOK_CALLBACK_REDIRECT,
  USER_FACEBOOK_APP_ID,
  USER_FACEBOOK_APP_SECRET,
} from "../../keys/index";
import { registerUserFacebook } from "../userControllers/registerUserFacebook";

declare module "express-session" {
  interface SessionData {
    accessToken: string;
    user: any;
  }
}

export const facebookAuth = (request: Request, response: Response) => {
  const authUrl = `${FACEBOOK_AUTH_URL}?client_id=${USER_FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_AUTH_REDIRECT_URI}&scope=email,public_profile,instagram_basic`;
  response.redirect(authUrl);
};

export const facebookCallback = async (
  request: Request,
  response: Response
) => {
  const facebookCode = request.query.code as string;
  if (!facebookCode) {
    return response.redirect(ERROR_REDIRECT_URI);
  }

  try {
    const tokenResponse = await axios.get(FACEBOOK_TOKEN_URI, {
      params: {
        client_id: USER_FACEBOOK_APP_ID,
        redirect_uri: FACEBOOK_AUTH_REDIRECT_URI,
        client_secret: USER_FACEBOOK_APP_SECRET,
        code: facebookCode,
      },
    });

    const shortLivedAccessToken = tokenResponse.data.access_token;

    const longLivedTokenResponse = await axios.get(FACEBOOK_TOKEN_URI, {
      params: {
        grant_type: "fb_exchange_token",
        client_id: USER_FACEBOOK_APP_ID,
        client_secret: USER_FACEBOOK_APP_SECRET,
        fb_exchange_token: shortLivedAccessToken,
      },
    });

    const longLivedAccessToken = longLivedTokenResponse.data.access_token;

    const profileResponse = await axios.get(FACEBOOK_PROFILE_URI, {
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
    }

    const user = await registerUserFacebook(newUser);

    request.session.user = profile;

    request.session.accessToken = longLivedAccessToken;


    request.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
      }
      response.redirect(FACEBOOK_CALLBACK_REDIRECT);
    });
  } catch (error: any) {
    console.error('facebook callback error', error.response ? error.response.data : error.message);
    response.redirect(ERROR_REDIRECT_URI);
  }
};
