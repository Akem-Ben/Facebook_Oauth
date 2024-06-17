import { Request, Response } from "express";
import { sendMessages } from "../controllers/userControllers/sendMessages";
import axios from "axios";

// Webhook verification
export const verifyWebhook = (request: Request, response: Response) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
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

// Webhook endpoint to handle messages
export const handleWebhook = async (request: Request, response: Response) => {
  try {
    const body = request.body;

    if (body.object === "instagram") {
      const promises = body.entry.map(async (entry: any) => {
        if (entry.messaging && entry.messaging.length > 0) {
          const message = entry.messaging[0];
          console.log("Message received:", message);

          const setMessage = "Thank you for reaching out. We will get back to you soon.";
          const recipientId = message.sender.id;

          try {
            console.log(`Message sending to ${body.recipient.id}`);
            await sendMessages(setMessage, recipientId);
          } catch (sendError:any) {
            console.error(`Error sending message to ${body.recipient.id}:`, sendError.response ? sendError.response.data : sendError.message);
          }
          }
          });
          
          await Promise.all(promises);
          response.status(200).send("EVENT_RECEIVED");
          } else {
            response.sendStatus(404);
            }
  } catch (error: any) {
    console.error("Webhook handling error:", error.response ? error.response.data : error.message);
    response.sendStatus(500);
  }
};
