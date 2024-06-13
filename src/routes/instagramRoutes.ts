import express from "express";
import { instagramAuth, instagramCallback } from "../controllers/instagramAuth/instagram-auth";
import { instagramRedirect } from "../controllers/instagramAuth/redirectFunction";

const router = express.Router();

router.get('/auth/instagram', instagramAuth);
router.get('/auth/instagram/callback', instagramCallback);


export default router;
