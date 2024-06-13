"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const facebook_auth_1 = require("../controllers/facebookAuth/facebook-auth");
const instagram_auth_1 = require("../controllers/instagramAuth/instagram-auth");
const redirectFunction_1 = require("../controllers/facebookAuth/redirectFunction");
const redirectFunction_2 = require("../controllers/instagramAuth/redirectFunction");
const router = express_1.default.Router();
router.get("/auth/facebook", facebook_auth_1.newPassport.authenticate("facebook"));
router.get("/auth/facebook/callback", instagram_auth_1.newInstagramPass.authenticate("instagram", {
    failureRedirect: "http://localhost:5173/failure",
}), redirectFunction_1.facebookRedirect);
router.get("/auth/instagram/callback", instagram_auth_1.newInstagramPass.authenticate("instagram", {
    failureRedirect: "http://localhost:5173/failure",
}), redirectFunction_2.instagramRedirect);
router.get("/auth/instagram", instagram_auth_1.newInstagramPass.authenticate("instagram"));
exports.default = router;
