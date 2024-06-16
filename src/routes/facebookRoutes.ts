import express from "express";
import { facebookAuth, facebookCallback } from "../controllers/facebookAuth/facebook-auth";
import { logout } from "../controllers/facebookAuth/logout";
import { instagramAuth, instagramCallback } from "../controllers/instagramAuth/instagram-auth";
import { handleWebhook, verifyWebhook } from "../middlewares/webhooks";

const router = express.Router();

router.get('/auth/facebook', facebookAuth);
router.get('/auth/facebook/callback', facebookCallback);
router.get('/auth/instagram', instagramAuth);
router.get('/auth/instagram/callback', instagramCallback);
router.post('/logout/:accessToken', logout);
router.get('/webhook', verifyWebhook)
router.post('/webhook', handleWebhook)

export default router;


