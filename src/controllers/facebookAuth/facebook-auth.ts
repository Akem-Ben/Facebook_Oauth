import { Request, Response } from 'express';
import axios from 'axios';
import 'express-session';

const REDIRECT_URI = "http://localhost:3030/auth/facebook/callback";

declare module 'express-session' {
  interface SessionData {
    accessToken: string;
    user: any;
  }
}



export const facebookAuth = (request: Request, response: Response) => {
  const authUrl = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=email,public_profile`;
  response.redirect(authUrl);
};

export const facebookCallback = async (request: Request, response: Response) => {
  const facebookCode = request.query.code as string;

  if (!facebookCode) {
    return response.redirect('http://localhost:5173/failure');
  }

  try {
    const tokenResponse = await axios.get(
      `https://graph.facebook.com/v10.0/oauth/access_token`, {
        params: {
          client_id: process.env.FACEBOOK_APP_ID as string,
          redirect_uri: REDIRECT_URI,
          client_secret: process.env.FACEBOOK_APP_SECRET as string,
          code: facebookCode,
        },
      }
    );

const shortLivedAccessToken = tokenResponse.data.access_token;

const longLivedTokenResponse = await axios.get(
  `https://graph.facebook.com/v10.0/oauth/access_token`, {
    params: {
      grant_type: 'fb_exchange_token',
      client_id: process.env.FACEBOOK_APP_ID as string,
      client_secret: process.env.FACEBOOK_APP_SECRET as string,
      fb_exchange_token: shortLivedAccessToken,
    },
  }
);

const longLivedAccessToken = longLivedTokenResponse.data.access_token;

    const profileResponse = await axios.get(`https://graph.facebook.com/me`, {
      params: {
        access_token: longLivedAccessToken,
        fields: "id,last_name,email,about,age_range,avatar_2d_profile_picture,birthday,education,favorite_athletes,favorite_teams,first_name,hometown,gender,id_for_avatars,inspirational_people,install_type,installed,is_guest_user,languages,link,location,middle_name,name,photos",
      },
    });

    const profile = profileResponse.data;

    console.log('prof', profile)

    // Register or update user in your database
    // const { error } = await supabase.from('users').upsert({
    //   id: profile.id,
    //   name: profile.name,
    //   access_token: accessToken,
    // });

    // if (error) {
    //   throw new Error('Failed to save user');
    // }

    // Save user info to session
    // request.session.user = profile;

    // request.session.user = profile;
    // const user = profile
    request.session.accessToken = longLivedAccessToken;

    response.redirect('http://localhost:3030/auth/instagram');
  } catch (error: any) {
    console.error(error.message);
    response.redirect('/failure');
  }
};



// prof {
//   id: '2113838078997567',
//   last_name: 'Kick',
//   email: 'smartkicks01@gmail.com',
//   first_name: 'Smart',
//   install_type: 'UNKNOWN',
//   installed: true,
//   is_guest_user: false,
//   name: 'Smart Kick'
// }
// &config_id=${2564397997087876}