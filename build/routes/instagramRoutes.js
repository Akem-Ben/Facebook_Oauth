"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const instagram_auth_1 = require("../controllers/instagramAuth/instagram-auth");
const router = express_1.default.Router();
router.get('/auth/instagram', instagram_auth_1.instagramAuth);
router.get('/auth/instagram/callback', instagram_auth_1.instagramCallback);
exports.default = router;
