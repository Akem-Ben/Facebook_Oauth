import { supabase } from "../../app"; // Assuming supabase is initialized in app.ts
import { Request, Response } from 'express';
import axios from 'axios';
import { MESSAGE_SENDING_URL, MY_LONG_LIVED_ACCESS_TOKEN } from "../../keys";
import { emitMessage } from "../../app";



export const sendMessages = async (usermessage:string, userId:string) => {
  try{

    const accessToken = MY_LONG_LIVED_ACCESS_TOKEN;

    let body = {
      platform: "instagram",
      recipient: { id: userId },
      message: { text: usermessage }
    }

    const response =  await axios.post(`${MESSAGE_SENDING_URL}?access_token=${accessToken}`, JSON.stringify(body),{
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if(response.status !== 200){
      emitMessage('error');
      return 'error'
    }else{
      emitMessage(usermessage);
      return 'success'
    }

  }catch(error:any){
    console.log(error.response.data)
  }
}
