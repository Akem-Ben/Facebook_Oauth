"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newInstagramPass = void 0;
const passport_instagram_1 = require("passport-instagram");
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.newInstagramPass = passport_1.default.use(new passport_instagram_1.Strategy({
    clientID: `${process.env.INSTAGRAM_APP_ID}`,
    clientSecret: `${process.env.INSTAGRAM_APP_SECRET}`,
    callbackURL: "http://localhost:3030/auth/instagram/callback"
}, async function (accessToken, refreshToken, profile, done) {
    console.log('access', accessToken);
    console.log('refresh', refreshToken);
    console.log('prof', profile);
}));
// app.get('/auth/instagram',
//     passport.authenticate('instagram'));
//   app.get('/auth/instagram/callback', 
//     passport.authenticate('instagram', { failureRedirect: '/login' }),
//     function(req, res) {
//       // Successful authentication, redirect home.
//       res.redirect('/');
//     });
