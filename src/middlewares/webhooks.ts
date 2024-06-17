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
  }
};

// Webhook endpoint to handle messages
export const handleWebhook = async (request: Request, response: Response) => {
  try {
    const body = request.body;

    if (body.object === "instagram") {
      body.entry.forEach(async (entry: any) => {
        const message = entry.messaging[0];

        console.log("Message received:", message);

        const setMessage = "Thank you for reaching out. We will get back to you soon.";

        const recipientId = message.sender.id;

        const accessToken = process.env.MY_LONG_ACCESS_TOKEN;

        const body = {
          message: setMessage,
          userId: recipientId,
          accessToken,
        };

        const check = await axios.post(
          "http://localhost:3030/send-message",
          body, {
            headers: {
            'contentType': 'application/jon'
            }
          }
        );
      });
      response.status(200).send("EVENT_RECEIVED");
    } else {
      response.sendStatus(404);
    }
  } catch (error: any) {
    console.error(error.response);
    response.sendStatus(500);
  }
};
