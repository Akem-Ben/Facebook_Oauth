"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = require("../keys");
const JWT_SECRET = 'your_secret_key'; // Use a strong, secure key
function signToken(payload) {
    return jsonwebtoken_1.default.sign(payload, keys_1.APP_SECRET, { expiresIn: '60d' }); // Example expiry time of 60 days
}
exports.signToken = signToken;
function verifyToken(access_token) {
    try {
        return jsonwebtoken_1.default.verify(access_token, keys_1.APP_SECRET);
    }
    catch (err) {
        console.error('Invalid token:', err);
        return null;
    }
}
exports.verifyToken = verifyToken;
