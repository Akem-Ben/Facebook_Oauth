import dotenv from 'dotenv';

dotenv.config();

// ==================== PORT, DATABASE AND GENERAL =====================
export const APP_SECRET = process.env.APP_SECRET!
export const PORT = process.env.PORT!
export const PUBLIC_KEY = process.env.PUBLIC_KEY!
export const ERROR_REDIRECT_URI = process.env.ERROR_REDIRECT_URI!
export const DATABASE_URL = process.env.DATABASE_URL!
export const APP_KEY = process.env.APP_KEY!
export const FETCH_USER_PROFILE_URL = process.env.FETCH_USER_PROFILE_URL!


//======================= USER FACEBOOK ======================
export const FACEBOOK_AUTH_URL = process.env.FACEBOOK_AUTH_URL!
export const FACEBOOK_AUTH_REDIRECT_URI = process.env.FACEBOOK_AUTH_REDIRECT_URI!
export const FACEBOOK_TOKEN_URI = process.env.FACEBOOK_TOKEN_URI!
export const FACEBOOK_PROFILE_URI = process.env.FACEBOOK_PROFILE_URI!
export const FACEBOOK_CALLBACK_REDIRECT = process.env.FACEBOOK_CALLBACK_REDIRECT!
export const USER_FACEBOOK_APP_ID = process.env.USER_FACEBOOK_APP_ID!
export const USER_FACEBOOK_APP_SECRET = process.env.USER_FACEBOOK_APP_SECRET!


//======================= USER INSTAGRAM ======================
export const MY_INSTAGRAM_USER_ID = process.env.MY_INSTAGRAM_USER_ID!
export const INSTAGRAM_AUTH_REDIRECT_URI = process.env.INSTAGRAM_AUTH_REDIRECT_URI!
export const INSTAGRAM_AUTH_URL = process.env.INSTAGRAM_AUTH_URL!
export const INSTAGRAM_SHORT_LIVED_ACCESS_TOKEN_URI = process.env.INSTAGRAM_SHORT_LIVED_ACCESS_TOKEN_URI!
export const INSTAGRAM_LONG_LIVED_ACCESS_TOKEN_URI = process.env.INSTAGRAM_LONG_LIVED_ACCESS_TOKEN_URI!
export const INSTAGRAM_PROFILE_URI = process.env.INSTAGRAM_PROFILE_URI!
export const USER_INSTAGRAM_APP_ID = process.env.USER_INSTAGRAM_APP_ID!
export const USER_INSTAGRAM_APP_SECRET = process.env.USER_INSTAGRAM_APP_SECRET!


//======================= ADMIN SECRETS ======================
export const ADMIN_FACEBOOK_APP_ID = process.env.ADMIN_FACEBOOK_APP_ID!
export const ADMIN_FACEBOOK_APP_SECRET = process.env.ADMIN_FACEBOOK_APP_SECRET!
export const ADMIN_INSTAGRAM_PROFILE_URI = process.env.ADMIN_INSTAGRAM_PROFILE_URI!
export const ADMIN_SCOPED_ID = process.env.ADMIN_SCOPED_ID!


//======================= MESSENGER ======================
export const VERIFY_TOKEN = process.env.VERIFY_TOKEN!
export const MY_SHORT_LIVED_ACCESS_TOKEN = process.env.MY_SHORT_LIVED_ACCESS_TOKEN!
export const MY_LONG_LIVED_ACCESS_TOKEN = process.env.MY_LONG_LIVED_ACCESS_TOKEN!
export const MESSAGE_SENDING_URL = process.env.MESSAGE_SENDING_URL!
export const FETCH_CONVERSATIONS_URL = process.env.FETCH_CONVERSATIONS_URL!
export const GET_MESSAGES_URL = process.env.GET_MESSAGES_URL!
export const ADMIN_FACEBOOK_PAGE_ID = process.env.ADMIN_FACEBOOK_PAGE_ID!
export const FETCH_ADMIN_CONVERSATIONS_DETAILS_URI = process.env.FETCH_ADMIN_CONVERSATIONS_DETAILS_URI!