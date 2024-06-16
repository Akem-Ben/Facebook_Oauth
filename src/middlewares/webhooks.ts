import { Request, Response } from "express";

// Webhook verification

export const verifyWebhook = (request: Request, response: Response) => {

  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = request.query['hub.mode'];
  const token = request.query['hub.verify_token'];
  const challenge = request.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      response.status(200).send(challenge);
    } else {
      response.sendStatus(403);
    }
  }
};


// Webhook endpoint to handle messages
export const handleWebhook = (request: Request, response: Response) => {
    try{
  const body = request.body;

  if (body.object === 'instagram') {
    body.entry.forEach((entry: any) => {
      const message = entry.messaging[0];
      console.log('Message received:', message);
      // Handle message event here
    });
    response.status(200).send('EVENT_RECEIVED');
  } else {
    response.sendStatus(404);
  }
}catch(error:any){
    console.error(error.response);
    response.sendStatus(500);
}
}

