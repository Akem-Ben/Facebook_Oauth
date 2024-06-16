import axios from 'axios';
import { supabase } from '../app';
import { signToken, verifyToken } from './jwt-utils';

const APP_ID = 'your_app_id';
const APP_SECRET = 'your_app_secret';
const PAGE_ID = 'your_page_id';

export async function getFacebookShortlivedToken(code: string): Promise<string> {
  const response = await axios.get(`https://graph.facebook.com/v20.0/oauth/access_token`, {
    params: {
      client_id: process.env.FACEBOOK_APP_ID as string,
      redirect_uri: process.env.REDIRECT_URI,
      client_secret: process.env.FACEBOOK_APP_SECRET as string,
      code: code,
    },
  }
);;
  return response.data.access_token;
}

export async function getFacebookLonglivedToken(shortLivedToken: string): Promise<string> {
  const response = await axios.get('https://graph.facebook.com/oauth/access_token', {
    params: {
      grant_type: 'fb_exchange_token',
      client_id: APP_ID,
      client_secret: APP_SECRET,
      fb_exchange_token: shortLivedToken
    }
  });
  return response.data.access_token;
}

export async function getPageAccessToken(page_access_token: string): Promise<string> {
  const response = await axios.get(`https://graph.facebook.com/${PAGE_ID}`, {
    params: {
      fields: 'access_token',
      access_token: page_access_token
    }
  });
  return response.data.access_token;
}

export async function refreshPageAccessToken(): Promise<void> {
  // Retrieve the current token data from Supabase
  const { data, error } = await supabase
    .from('tokens')
    .select('token')
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching token:', error);
    return;
  }

  const tokenData:any = verifyToken(data.token);
  if (!tokenData) {
    console.error('Invalid token data');
    return;
  }

  const currentUserAccessToken = tokenData.userAccessToken;

  try {
    // Get new long-lived user access token
    const newUserAccessToken = await getFacebookLonglivedToken(currentUserAccessToken);

    // Get new page access token
    const newPageAccessToken = await getPageAccessToken(newUserAccessToken);

    // Create JWT with new tokens
    const newToken = signToken({ userAccessToken: newUserAccessToken, pageAccessToken: newPageAccessToken });

    // Store the signed JWT in Supabase
    await supabase.from('tokens').insert([{ token: newToken }]);

    console.log('Tokens refreshed and stored successfully');
  } catch (error) {
    console.error('Error refreshing tokens:', error);
  }
}
