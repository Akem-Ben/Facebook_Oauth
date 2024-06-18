import { Request, Response } from "express";
import { sendMessages } from "../controllers/userControllers/sendMessages";
import {ADMIN_SCOPED_ID, VERIFY_TOKEN} from '../keys'
import axios from "axios";
import { supabase } from "../app";

// Webhook verification
export const verifyWebhook = (request: Request, response: Response) => {

  const mode = request.query["hub.mode"];
  const token = request.query["hub.verify_token"];
  const challenge = request.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      response.status(200).send(challenge);
    } else {
      response.sendStatus(403);
    }
  } else {
    response.sendStatus(400);
  }
};

// Webhook endpoint to handle first time messages
export const handleWebhook = async (request: Request, response: Response) => {
  try {
    const body = request.body;
console.log(body.entry[0].messaging)
    if (body.object === "instagram") {
      const promises = body.entry.map(async (entry: any) => {
        if (entry.messaging && entry.messaging.length > 0) {
          const message = entry.messaging[0];
          let checkUserId = message.sender.id;

          if(checkUserId === ADMIN_SCOPED_ID){
            return;
          }
          
          const { data: findScopedId, error: findScopedIdError } = await supabase
          .from('users')
          .select('*')
          .eq('instagram_scoped_id', checkUserId)
          .single();
          
          if(findScopedId){
            return;
          }

          const setMessage = "Thank you for reaching out. We will get back to you soon.";
          const recipientId = message.sender.id;

          let user;
          try {
          return user = await sendMessages(setMessage, recipientId);
          } catch (sendError:any) {
            console.error(`Error sending message to ${recipientId}:`, sendError.response ? sendError.response.data : sendError.message);
          }
          }
          });
          
          await Promise.all(promises);
         return response.status(200).json({message: "EVENT_RECEIVED"});
          } else {
            response.sendStatus(404);
            }
  } catch (error: any) {
    console.error("Webhook handling error:", error.response ? error.response.data : error.message);
    response.sendStatus(500);
  }
}