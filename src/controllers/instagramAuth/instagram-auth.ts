import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { JwtPayload } from "jsonwebtoken";
import qs from "qs";
import {
  INSTAGRAM_AUTH_URL,
  USER_INSTAGRAM_APP_ID,
  INSTAGRAM_AUTH_REDIRECT_URI,
  ERROR_REDIRECT_URI,
  INSTAGRAM_SHORT_LIVED_ACCESS_TOKEN_URI,
  USER_INSTAGRAM_APP_SECRET,
  INSTAGRAM_LONG_LIVED_ACCESS_TOKEN_URI,
  INSTAGRAM_PROFILE_URI,
  ADMIN_INSTAGRAM_PROFILE_URI,
} from "../../keys";
import { registerUserInstagram } from "./registerUserInstagram";

export const instagramAuth = async (request: JwtPayload, response: Response) => {
  const authUrl = `${INSTAGRAM_AUTH_URL}?client_id=${USER_INSTAGRAM_APP_ID}&redirect_uri=${INSTAGRAM_AUTH_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  response.cookie("user", request.session.user);
  response.cookie("accessToken", request.session.accessToken);
  request.session.save(() => {
    response.redirect(authUrl);
  });
};

export const instagramCallback = async (
  request: JwtPayload,
  response: Response
) => {
  try {

    const facebook_details = request.cookies.user
    const facebook_access_token = request.cookies.accessToken

    console.log('facebook details', facebook_details, facebook_access_token)

    const instagramCode = request.query.code as string;

    if (!instagramCode) {
      return response.redirect(ERROR_REDIRECT_URI);
    }
    const tokenResponse = await axios.post(
      INSTAGRAM_SHORT_LIVED_ACCESS_TOKEN_URI,
      qs.stringify({
        client_id: USER_INSTAGRAM_APP_ID,
        client_secret: USER_INSTAGRAM_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: INSTAGRAM_AUTH_REDIRECT_URI,
        code: instagramCode,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const shortLivedAccessToken = tokenResponse.data.access_token;

    const instegramUserId = tokenResponse.data.user_id;

    const longLivedTokenResponse = await axios.get(
      INSTAGRAM_LONG_LIVED_ACCESS_TOKEN_URI,
      {
        params: {
          grant_type: "ig_exchange_token",
          client_secret: USER_INSTAGRAM_APP_SECRET,
          access_token: shortLivedAccessToken,
        },
      }
    );

    const longLivedAccessToken = longLivedTokenResponse.data.access_token;

    const profileResponse = await axios.get(
      `${INSTAGRAM_PROFILE_URI}/${instegramUserId}`,
      {
        params: {
          access_token: longLivedAccessToken,
          fields: "id,username,account_type,media_count",
        },
      }
    );

    const instagramProfile = profileResponse.data;
   
  const profile = {
    instagram_id: instagramProfile.id,
    instagram_user_name: instagramProfile.username,
    instagram_account_type: instagramProfile.account_type,
    instagram_media_count: instagramProfile.media_count,
    instagram_access_token: longLivedAccessToken
  }

  await registerUserInstagram(profile);

    response.redirect(ADMIN_INSTAGRAM_PROFILE_URI);
  } catch (error: any) {
    console.error("Instagram Auth Error:", error.response ? error.response.data : error.message);
    response.redirect(ERROR_REDIRECT_URI);
  }
};
