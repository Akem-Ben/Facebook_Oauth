import { supabase } from "../../app";
import { v4 } from 'uuid';

export const registerUser = async(profile:any) => {
  const { id, emails, name, gender, profileUrl } = profile;

  const { data: findAdmin, error: findAdminError } = await supabase
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
        id: id,
        userId: v4(),
        ...userDetails
      });

    if (createAdminError) {
      console.error('Error creating user:', createAdminError.message);
      return 'error';
    }

    return 'success';
  }
}
