"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserInstagram = void 0;
const app_1 = require("../../app");
const uuid_1 = require("uuid");
const registerUserInstagram = async (profile) => {
    try {
        const { instagram_id, instagram_user_name, instagram_account_type, instagram_media_count, instagram_access_token } = profile;
        const { data: findUser, error: findUserError } = await app_1.supabase
            .from('users')
            .select('*')
            .eq('instagram_id', instagram_id)
            .single();
        const userDetails = {
            instagram_id,
            instagram_user_name,
            instagram_account_type,
            instagram_media_count,
            instagram_access_token,
        };
        if (findUser) {
            const { data: updateUser, error: updateUserError } = await app_1.supabase
                .from('users')
                .update(userDetails)
                .eq('instagram_id', instagram_id);
            if (updateUserError) {
                console.error('Error updating user:', updateUserError.message);
                return 'error';
            }
            return 'success';
        }
        else {
            console.log('User not found, creating new user');
            const { data: createUser, error: createUserError } = await app_1.supabase
                .from('users')
                .insert({
                id: (0, uuid_1.v4)(),
                ...userDetails,
            });
            if (createUserError) {
                console.error('Error creating user:', createUserError.message);
                return 'error';
            }
            return 'success';
        }
    }
    catch (error) {
        console.log('register user instagram error', error.response ? error.response.data : error.message);
    }
};
exports.registerUserInstagram = registerUserInstagram;
