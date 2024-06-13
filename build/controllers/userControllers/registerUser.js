"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const app_1 = require("../../app");
const uuid_1 = require("uuid");
const registerUser = async (profile) => {
    const { id, emails, name, gender, profileUrl } = profile;
    const { data: findAdmin, error: findAdminError } = await app_1.supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
    const userDetails = {
        email: (emails && emails[0]?.value !== 'undefined') ? emails[0].value : null,
        lastName: (name?.familyName !== 'undefined') ? name.familyName : null,
        firstName: (name?.givenName !== 'undefined') ? name.givenName : null,
        middleName: (name?.middleName !== 'undefined') ? name.middleName : null,
        gender: (gender !== 'undefined') ? gender : null,
        profileUrl: (profileUrl !== 'undefined') ? profileUrl : null,
    };
    if (findAdmin) {
        console.log('User found, updating details:', findAdmin);
        const { data: updateAdmin, error: updateAdminError } = await app_1.supabase
            .from('users')
            .update(userDetails)
            .eq('id', id);
        if (updateAdminError) {
            console.error('Error updating user:', updateAdminError.message);
            return 'error';
        }
        return 'success';
    }
    else {
        console.log('User not found, creating new user');
        const { data: saveAdmin, error: createAdminError } = await app_1.supabase
            .from('users')
            .insert({
            id: id,
            userId: (0, uuid_1.v4)(),
            ...userDetails
        });
        if (createAdminError) {
            console.error('Error creating user:', createAdminError.message);
            return 'error';
        }
        return 'success';
    }
};
exports.registerUser = registerUser;
