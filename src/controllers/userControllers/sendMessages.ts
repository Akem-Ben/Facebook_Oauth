import { supabase } from "../../app"; // Assuming supabase is initialized in app.ts
import { Request, Response } from 'express';
import axios from 'axios';



export const sendMessages = async (req: Request, res: Response) => {
  const { message, userId } = req.body;

  let users;
  if (userId) {
    users = [{ id: userId }];
  } else {
    const { data, error } = await supabase.from('instagram_users').select('id');
    if (error) {
      return res.status(500).send('Error fetching users');
    }
    users = data;
  }

  const accessToken = "your-instagram-access-token"; // Replace with actual token

  users.forEach(async (user: any) => {
    try {
      await axios.post(
        `https://graph.instagram.com/me/messages`,
        {
          recipient: { id: user.id },
          message: { text: message }
        },
        { params: { access_token: accessToken } }
      );
    } catch (error: any) {
      console.error(`Error sending message to user ${user.id}:`, error.response.data);
    }
  });

  res.status(200).send('Messages sent');
}
