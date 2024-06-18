import axios from "axios";
import { Request, Response } from "express";
import {
  FETCH_CONVERSATIONS_URL,
  GET_MESSAGES_URL,
  MY_LONG_LIVED_ACCESS_TOKEN,
} from "../../keys";
import { formatDate, formatTimeFromISO } from "../../utilities/helperFunctions";

export const getConversations = async (
  request: Request,
  response: Response
) => {
  try {
    const conversations = await axios.get(FETCH_CONVERSATIONS_URL);
console.log('con', conversations)
    if (
      !conversations.data.messages.data ||
      conversations.data.messages.data.length === 0 ||
      conversations.data.messages.data === undefined
    ) {
      return response.status(404).json({
        message: "No conversations found.",
        data: [],
      });
    }

    const messages = conversations.data.messages.data;

    const detailsPromises = messages.map(async (msg: any) => {
      const user_message = await axios.get(
        `${GET_MESSAGES_URL}/${msg.id}?fields=id,created_time,from,to,message&access_token=${MY_LONG_LIVED_ACCESS_TOKEN}`
      );

      return {
        userName: user_message.data.from.username,
        userId: user_message.data.from.id,
        message: user_message.data.message,
        date: formatDate(user_message.data.created_time),
        time: formatTimeFromISO(user_message.data.created_time),
      };
    });

    const details = await Promise.all(detailsPromises);

    return response.status(200).json({ data: details });
  } catch (error: any) {
    console.log('fetch user conversation error', error.response ? error.response.data : error.message)
    return response.status(500).json({ message: 'error, contact admin' });
  }
};
