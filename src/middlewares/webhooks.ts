import { Request, Response } from "express";
import { sendMessages } from "../controllers/userControllers/sendMessages";
import { ADMIN_SCOPED_ID, FETCH_USER_PROFILE_URL, MY_LONG_LIVED_ACCESS_TOKEN, VERIFY_TOKEN } from "../keys";
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

    if (body.object === "instagram") {
      const promises = body.entry.map(async (entry: any) => {
        if (entry.messaging && entry.messaging.length > 0) {
          const message = entry.messaging[0];
          let checkUserId = message.sender.id;

          if (checkUserId === ADMIN_SCOPED_ID) {
            return;
          }

          const { data: findScopedId, error: findScopedIdError } =
            await supabase
              .from("users")
              .select("*")
              .eq("instagram_scoped_id", checkUserId)
              .single();

          if (findScopedId) {
            return;
          }

          const findUser = await axios.get(
            `${FETCH_USER_PROFILE_URL}/${checkUserId}?fields=name,username,is_user_follow_business,is_business_follow_user`, {
              params: {
                access_token : MY_LONG_LIVED_ACCESS_TOKEN
              }
            }
          );

          const userDetails = findUser.data;

          const { data: findUserName, error: findUserNameError } =
            await supabase
              .from("users")
              .select("*")
              .eq("instagram_user_name", userDetails.username)
              .single();

              if (findUserName) {
                const { data: updateUser, error: updateUserError } = await supabase
                  .from('users')
                  .update({ instagram_scoped_id: checkUserId })
                  .eq('instagram_user_name', userDetails.username);
    
                if (updateUserError) {
                  console.error('Error updating user:', updateUserError.message);
                }
              }

          const setMessage =
            `Thank you for reaching out. We will get back to you soon. Please visit our site on www.me.ng to register and be included in our database. ${!userDetails.is_user_follow_business ? "Please follow our account to get new updates." : ""}`;
          const recipientId = message.sender.id;

          let user;
          try {
            return (user = await sendMessages(setMessage, recipientId));
          } catch (sendError: any) {
            console.error(
              `Error sending message to ${recipientId}:`,
              sendError.response ? sendError.response.data : sendError.message
            );
          }
        }
      });

      await Promise.all(promises);
      return response.status(200).json({ message: "EVENT_RECEIVED" });
    } else {
      response.sendStatus(404);
    }
  } catch (error: any) {
    console.error(
      "Webhook handling error:",
      error.response ? error.response.data : error.message
    );
    response.sendStatus(500);
  }
};
