import express from "express";
import { facebookAuth, facebookCallback } from "../controllers/facebookAuth/facebook-auth";
import { logout } from "../controllers/facebookAuth/logout";
import { instagramAuth, instagramCallback } from "../controllers/instagramAuth/instagram-auth";
import { conveyor } from "../middlewares/id-conveyor";

const router = express.Router();

router.get('/auth/facebook', facebookAuth);
router.get('/auth/facebook/callback', conveyor, facebookCallback);
router.get('/auth/instagram', instagramAuth);
router.get('/auth/instagram/callback', instagramCallback);
router.post('/logout/:accessToken', logout);

export default router;


