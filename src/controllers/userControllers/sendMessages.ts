import { supabase } from "../../app"; // Assuming supabase is initialized in app.ts
import { Request, Response } from 'express';
import axios from 'axios';



export const sendMessages = async (request: Request, response: Response) => {
  try{
  const { message, userId, accessToken } = request.body;

//   let users;
//   if (userId) {
//     users = [{ id: userId }];
//   } else {
//     const { data, error } = await supabase.from('instagram_users').select('id');
//     if (error) {
//       return response.status(500).send('Error fetching users');
//     }
//     users = data;
//   }


    // try {
    const sender =  await axios.post(
        `https://graph.instagram.com/v20.0/me/messages`,
        {
          recipient: { id: userId },
          message: { text: message }
        },
        { params: { access_token: accessToken } }
      );

      console.log(sender.data)

    // } catch (error: any) {
    //   console.error(`Error sending message to user ${userId}:`, error.response.data);
    // }

  }catch(error:any){
    console.log(error.response)
  }
}
