import { supabase } from "../../app";
import { v4 } from 'uuid';

export const registerUserFacebook = async(profile:any) => {
  // prof {
//   id: '2113838078997567',
//   last_name: 'Kick',
//   email: 'smartkicks01@gmail.com',
//   first_name: 'Smart',
//   install_type: 'UNKNOWN',
//   installed: true,
//   is_guest_user: false,
//   name: 'Smart Kick'
// }
  const { id,
    last_name,
    email,
    first_name,
    gender,
    middle_name,
    display_name,
    access_token } = profile;

  const { data: findAdmin, error: findAdminError } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  const userDetails = {
    id,
    email,
    last_name,
    first_name,
    middle_name,
    gender,
    display_name,
    facebook_access_token: access_token
  };
  

  if (findAdmin) {
    console.log('User found, updating details:', findAdmin);
    const { data: updateAdmin, error: updateAdminError } = await supabase
      .from('users')
      .update(userDetails)
      .eq('id', id);

    if (updateAdminError) {
      console.error('Error updating user:', updateAdminError.message);
      return 'error';
    }

    return 'success';
  } else {
    console.log('User not found, creating new user');
    const { data: saveAdmin, error: createAdminError } = await supabase
      .from('users')
      .insert({
        userId: v4(),
        ...userDetails
      })

    if (createAdminError) {
      console.error('Error creating user:', createAdminError.message);
      return 'error';
    }

    return 'success';
  }
}