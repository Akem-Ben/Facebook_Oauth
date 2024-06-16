import dotenv from 'dotenv';

dotenv.config();

export const APP_SECRET = process.env.APP_SECRET!
export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID!
export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET!
export const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID!
export const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID!
export const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET!
export const DATABASE_URL = process.env.DATABASE_URL!