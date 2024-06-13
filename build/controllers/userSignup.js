"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const app_1 = require("../app");
const uuid_1 = require("uuid");
const registerUser = async (request, response) => {
    try {
        const { firstName, lastName, email, phone, password } = request.body;
        if (!firstName || !lastName || !email || !phone) {
            return response.status(400).json({
                message: "All fields are required"
            });
        }
        const { data: findAdmin, error: findAdminError } = await app_1.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (findAdminError && findAdminError.code !== 'PGRST116') {
            return response.status(500).json({
                message: "Internal Server Error"
            });
        }
        if (findAdmin) {
            return response.status(400).json({
                message: "HR already exists"
            });
        }
        const { data: saveAdmin, error: createAdminError } = await app_1.supabase
            .from('users')
            .insert({
            id: (0, uuid_1.v4)(),
            firstName,
            lastName,
            email,
            phone,
            workEmail: email,
            password,
            isManager: true,
            designation: "HR"
        });
        if (createAdminError) {
            return response.status(400).json({
                message: "Unable to create, try again later"
            });
        }
        const { data: checkAdmin, error: checkAdminError } = await app_1.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (checkAdminError || !checkAdmin) {
            return response.status(400).json({
                message: "Unable to create, try again later"
            });
        }
        return response.status(200).json({
            message: "Admin Registered",
            checkAdmin,
            admin: {
                firstName: checkAdmin.firstName,
                lastName: checkAdmin.lastName,
                email: checkAdmin.email,
                workEmail: checkAdmin.workEmail,
                phone: checkAdmin.phone,
                designation: checkAdmin.designation
            }
        });
    }
    catch (error) {
        console.log(error.message);
        response.status(500).json({
            message: "Internal Server Error"
        });
    }
};
exports.registerUser = registerUser;
