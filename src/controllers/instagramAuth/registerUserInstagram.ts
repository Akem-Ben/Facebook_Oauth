import { supabase } from "../../app";
import { v4 } from 'uuid';
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

export const registerUserInstagram = async(request?:JwtPayload, profile?:any) => {
try{
  const { instagram_id,
    instagram_user_name,
    instagram_account_type,
    instagram_media_count,
    instagram_access_token } = profile;

    console.log('session', request?.session)
    console.log('prof', profile)

//   const { data: findAdmin, error: findAdminError } = await supabase
//     .from('users')
//     .select('*')
//     .eq('id', request.session.user.id)
//     .single();

//   const userDetails = {
//     instagram_id,
//     instagram_user_name,
//     instagram_account_type,
//     instagram_media_count,
//     instagram_access_token,
//   };
  

//   if (findAdmin) {
//     console.log('User found, updating details:', findAdmin);
//     const { data: updateAdmin, error: updateAdminError } = await supabase
//       .from('users')
//       .update(userDetails)
//       .eq('id', request.session.user.id);

//     if (updateAdminError) {
//       console.error('Error updating user:', updateAdminError.message);
//       return 'error';
//     }

//     return 'success';
//   } else {
//     console.log('User not found, creating new user');
//     return 'error'
//   }
}catch(error:any){
  console.log('register user instagram error', error.response ? error.response.data : error.message)
}
}
