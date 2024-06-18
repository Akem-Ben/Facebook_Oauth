import { supabase } from "../../app";
import { v4 } from 'uuid';
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

export const registerUserInstagram = async(profile?:any) => {
try{
  const { instagram_id,
    instagram_user_name,
    instagram_account_type,
    instagram_media_count,
    instagram_access_token } = profile;

  const { data: findUser, error: findUserError } = await supabase
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
    const { data: updateUser, error: updateUserError } = await supabase
      .from('users')
      .update(userDetails)
      .eq('instagram_id', instagram_id);

    if (updateUserError) {
      console.error('Error updating user:', updateUserError.message);
      return 'error';
    }

    return 'success';
  } else {
    console.log('User not found, creating new user');

    const { data: createUser, error: createUserError } = await supabase
    .from('users')
    .insert({
      id: v4(),
      ...userDetails,
    });

  if (createUserError) {
    console.error('Error creating user:', createUserError.message);
    return 'error';
  }

  return 'success';
  }
  
}catch(error:any){
  console.log('register user instagram error', error.response ? error.response.data : error.message)
}
}
