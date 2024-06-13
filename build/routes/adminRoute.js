"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const facebook_auth_1 = require("../controllers/facebookAuth/facebook-auth");
const redirectFunction_1 = require("../controllers/facebookAuth/redirectFunction");
const router = express_1.default.Router();
router.get('/auth/facebook', facebook_auth_1.newPassport.authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback', facebook_auth_1.newPassport.authenticate('facebook', { failureRedirect: 'http://localhost:5173/failure' }), redirectFunction_1.redirect);
exports.default = router;