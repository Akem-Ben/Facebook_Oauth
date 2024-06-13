"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookRedirect = void 0;
const facebookRedirect = (request, response) => {
    try {
        const REDIRECT_URI = 'http://localhost:5173/profile';
        response.redirect(REDIRECT_URI);
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.facebookRedirect = facebookRedirect;
//http://localhost:3030/auth/instagram
