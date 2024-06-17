import { supabase } from "../../app";
import { v4 } from 'uuid';

export const registerUserFacebook = async (profile: any) => {
  const { facebook_id, email, first_name, last_name, facebook_access_token } = profile;

  const { data: findAdmin, error: findAdminError } = await supabase
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

  const { data: saveAdmin, error: createAdminError } = await supabase
    .from('users')
    .insert({
      id: v4(),
      ...userDetails,
    });

  if (createAdminError) {
    console.error('Error creating user:', createAdminError.message);
    return 'error';
  }

  return 'success';
}






// updated_at

// instagram_id

// instagram_user_name

// instagram_account_type

// instagram_media_count

// instagram_access_token
