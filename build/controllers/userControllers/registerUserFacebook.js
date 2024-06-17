"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserFacebook = void 0;
const app_1 = require("../../app");
const uuid_1 = require("uuid");
const registerUserFacebook = async (profile) => {
    const { facebook_id, email, first_name, last_name, facebook_access_token } = profile;
    const { data: findAdmin, error: findAdminError } = await app_1.supabase
        .from('users')
        .select('*')
        .eq('facebook_id', facebook_id)
        .single();
    if (findAdmin) {
        return 'success';
    }
    const userDetails = {
        email,
        first_name,
        last_name,
        facebook_id,
        facebook_access_token
    };
    const { data: saveAdmin, error: createAdminError } = await app_1.supabase
        .from('users')
        .insert({
        id: (0, uuid_1.v4)(),
        ...userDetails,
    });
    if (createAdminError) {
        console.error('Error creating user:', createAdminError.message);
        return 'error';
    }
    return 'success';
};
exports.registerUserFacebook = registerUserFacebook;
// updated_at
// instagram_id
// instagram_user_name
// instagram_account_type
// instagram_media_count
// instagram_access_token
