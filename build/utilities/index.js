"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_URL = exports.INSTAGRAM_APP_SECRET = exports.INSTAGRAM_APP_ID = exports.FACEBOOK_PAGE_ID = exports.FACEBOOK_APP_SECRET = exports.FACEBOOK_APP_ID = exports.APP_SECRET = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.APP_SECRET = process.env.APP_SECRET;
exports.FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
exports.FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
exports.FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
exports.INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
exports.INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
exports.DATABASE_URL = process.env.DATABASE_URL;
