import { supabase } from "../../app"; // Assuming supabase is initialized in app.ts
import { Request, Response } from 'express';
import axios from 'axios';



export const sendMessages = async (usermessage:string, userId:string) => {
  try{

    const accessToken = process.env.MY_LONG_ACCESS_TOKEN as string;

    let body = {
      platform: "instagram",
      recipient: { id: userId },
      message: { text: usermessage }
    }

    console.log('body', body)

    console.log('token', accessToken)

    const response =  await axios.post(`https://graph.instagram.com/v20.0/me/messages?access_token=${accessToken}`, JSON.stringify(body),{
      headers: {
        'Content-Type': 'application/json'
      }
    });

      // console.log('response...',response.data)
      return response.data

  }catch(error:any){
    console.log(error.response)
  }
}
