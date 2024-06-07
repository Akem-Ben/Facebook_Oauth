"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const app_1 = require("../app");
const registerUser = async (request, response) => {
    try {
        const { email, password } = request.body;
        const { data, error } = await app_1.supabase.auth.signUp({
            email: 'example@email.com',
            password: 'example-password',
        });
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).json({
            message: `Internal Server Error, Please contact the admin`
        });
    }
};
exports.registerUser = registerUser;
