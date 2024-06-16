"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const facebook_auth_1 = require("../controllers/facebookAuth/facebook-auth");
const logout_1 = require("../controllers/facebookAuth/logout");
const instagram_auth_1 = require("../controllers/instagramAuth/instagram-auth");
const webhooks_1 = require("../middlewares/webhooks");
const router = express_1.default.Router();
router.get('/auth/facebook', facebook_auth_1.facebookAuth);
router.get('/auth/facebook/callback', facebook_auth_1.facebookCallback);
router.get('/auth/instagram', instagram_auth_1.instagramAuth);
router.get('/auth/instagram/callback', instagram_auth_1.instagramCallback);
router.post('/logout/:accessToken', logout_1.logout);
router.get('/webhook', webhooks_1.verifyWebhook);
router.post('/webhook', webhooks_1.handleWebhook);
exports.default = router;
