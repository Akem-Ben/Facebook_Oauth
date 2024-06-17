import { supabase } from "../../app"; // Assuming supabase is initialized in app.ts
import { Request, Response } from 'express';
import axios from 'axios';



export const sendMessages = async (message:string, userId:string, accessToken:string) => {
  try{

    const response =  await axios.post(
        `https://graph.instagram.com/v20.0/me/messages`,
        {
          recipient: { id: userId },
          message: { text: message }
        },
        { params: { access_token: accessToken } }
      );

      console.log('response...',response.data)
      return response.data

  }catch(error:any){
    console.log(error.response)
  }
}
