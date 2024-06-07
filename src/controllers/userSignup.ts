import { supabase } from "../app";
import {Request, Response} from 'express';


export const registerUser = async(request:Request, response:Response) => {

try{

    const {email, password} = request.body;

const { data, error } = await supabase.auth.signUp({
    email: 'example@email.com',
    password: 'example-password',
  })

}catch(error:any){
    console.log(error.message)
    return response.status(500).json({
        message: `Internal Server Error, Please contact the admin`
    })
}

}