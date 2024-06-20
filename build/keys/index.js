"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FETCH_ADMIN_CONVERSATIONS_DETAILS_URI = exports.ADMIN_FACEBOOK_PAGE_ID = exports.GET_MESSAGES_URL = exports.FETCH_CONVERSATIONS_URL = exports.MESSAGE_SENDING_URL = exports.MY_LONG_LIVED_ACCESS_TOKEN = exports.MY_SHORT_LIVED_ACCESS_TOKEN = exports.VERIFY_TOKEN = exports.ADMIN_SCOPED_ID = exports.ADMIN_INSTAGRAM_PROFILE_URI = exports.ADMIN_FACEBOOK_APP_SECRET = exports.ADMIN_FACEBOOK_APP_ID = exports.USER_INSTAGRAM_APP_SECRET = exports.USER_INSTAGRAM_APP_ID = exports.INSTAGRAM_PROFILE_URI = exports.INSTAGRAM_LONG_LIVED_ACCESS_TOKEN_URI = exports.INSTAGRAM_SHORT_LIVED_ACCESS_TOKEN_URI = exports.INSTAGRAM_AUTH_URL = exports.INSTAGRAM_AUTH_REDIRECT_URI = exports.MY_INSTAGRAM_USER_ID = exports.USER_FACEBOOK_APP_SECRET = exports.USER_FACEBOOK_APP_ID = exports.FACEBOOK_CALLBACK_REDIRECT = exports.FACEBOOK_PROFILE_URI = exports.FACEBOOK_TOKEN_URI = exports.FACEBOOK_AUTH_REDIRECT_URI = exports.FACEBOOK_AUTH_URL = exports.FETCH_USER_PROFILE_URL = exports.APP_KEY = exports.DATABASE_URL = exports.ERROR_REDIRECT_URI = exports.PUBLIC_KEY = exports.PORT = exports.APP_SECRET = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ==================== PORT, DATABASE AND GENERAL =====================
exports.APP_SECRET = process.env.APP_SECRET;
exports.PORT = process.env.PORT;
exports.PUBLIC_KEY = process.env.PUBLIC_KEY;
exports.ERROR_REDIRECT_URI = process.env.ERROR_REDIRECT_URI;
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.APP_KEY = process.env.APP_KEY;
exports.FETCH_USER_PROFILE_URL = process.env.FETCH_USER_PROFILE_URL;
//======================= USER FACEBOOK ======================
exports.FACEBOOK_AUTH_URL = process.env.FACEBOOK_AUTH_URL;
exports.FACEBOOK_AUTH_REDIRECT_URI = process.env.FACEBOOK_AUTH_REDIRECT_URI;
exports.FACEBOOK_TOKEN_URI = process.env.FACEBOOK_TOKEN_URI;
exports.FACEBOOK_PROFILE_URI = process.env.FACEBOOK_PROFILE_URI;
exports.FACEBOOK_CALLBACK_REDIRECT = process.env.FACEBOOK_CALLBACK_REDIRECT;
exports.USER_FACEBOOK_APP_ID = process.env.USER_FACEBOOK_APP_ID;
exports.USER_FACEBOOK_APP_SECRET = process.env.USER_FACEBOOK_APP_SECRET;
//======================= USER INSTAGRAM ======================
exports.MY_INSTAGRAM_USER_ID = process.env.MY_INSTAGRAM_USER_ID;
exports.INSTAGRAM_AUTH_REDIRECT_URI = process.env.INSTAGRAM_AUTH_REDIRECT_URI;
exports.INSTAGRAM_AUTH_URL = process.env.INSTAGRAM_AUTH_URL;
exports.INSTAGRAM_SHORT_LIVED_ACCESS_TOKEN_URI = process.env.INSTAGRAM_SHORT_LIVED_ACCESS_TOKEN_URI;
exports.INSTAGRAM_LONG_LIVED_ACCESS_TOKEN_URI = process.env.INSTAGRAM_LONG_LIVED_ACCESS_TOKEN_URI;
exports.INSTAGRAM_PROFILE_URI = process.env.INSTAGRAM_PROFILE_URI;
exports.USER_INSTAGRAM_APP_ID = process.env.USER_INSTAGRAM_APP_ID;
exports.USER_INSTAGRAM_APP_SECRET = process.env.USER_INSTAGRAM_APP_SECRET;
//======================= ADMIN SECRETS ======================
exports.ADMIN_FACEBOOK_APP_ID = process.env.ADMIN_FACEBOOK_APP_ID;
exports.ADMIN_FACEBOOK_APP_SECRET = process.env.ADMIN_FACEBOOK_APP_SECRET;
exports.ADMIN_INSTAGRAM_PROFILE_URI = process.env.ADMIN_INSTAGRAM_PROFILE_URI;
exports.ADMIN_SCOPED_ID = process.env.ADMIN_SCOPED_ID;
//======================= MESSENGER ======================
exports.VERIFY_TOKEN = process.env.VERIFY_TOKEN;
exports.MY_SHORT_LIVED_ACCESS_TOKEN = process.env.MY_SHORT_LIVED_ACCESS_TOKEN;
exports.MY_LONG_LIVED_ACCESS_TOKEN = process.env.MY_LONG_LIVED_ACCESS_TOKEN;
exports.MESSAGE_SENDING_URL = process.env.MESSAGE_SENDING_URL;
exports.FETCH_CONVERSATIONS_URL = process.env.FETCH_CONVERSATIONS_URL;
exports.GET_MESSAGES_URL = process.env.GET_MESSAGES_URL;
exports.ADMIN_FACEBOOK_PAGE_ID = process.env.ADMIN_FACEBOOK_PAGE_ID;
exports.FETCH_ADMIN_CONVERSATIONS_DETAILS_URI = process.env.FETCH_ADMIN_CONVERSATIONS_DETAILS_URI;
