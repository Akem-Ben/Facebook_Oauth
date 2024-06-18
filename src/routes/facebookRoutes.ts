import express from "express";
import { facebookAuth, facebookCallback } from "../controllers/facebookAuth/facebook-auth";
import { logout } from "../controllers/userControllers/logout";
import { instagramAuth, instagramCallback } from "../controllers/instagramAuth/instagram-auth";
import { handleWebhook, verifyWebhook } from "../middlewares/webhooks";
import { getConversations } from "../controllers/userControllers/fetchUserConversations";
import { sendMessagesEndpoint } from "../controllers/userControllers/messageSendingEndpoint";

const router = express.Router();

router.get('/auth/facebook', facebookAuth);
router.get('/auth/facebook/callback', facebookCallback);
router.get('/auth/instagram', instagramAuth);
router.get('/auth/instagram/callback', instagramCallback);
router.post('/logout/:accessToken', logout);
router.get('/webhook', verifyWebhook)
router.post('/webhook', handleWebhook)
router.get('/converse', getConversations)
router.post('/send-message', sendMessagesEndpoint)

export default router;


