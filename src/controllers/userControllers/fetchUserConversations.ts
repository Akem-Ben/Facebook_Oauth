import axios from "axios";
import { Request, Response } from "express";
import {
  ADMIN_SCOPED_ID,
  FETCH_ADMIN_CONVERSATIONS_DETAILS_URI,
  FETCH_CONVERSATIONS_URL,
  GET_MESSAGES_URL,
  MY_LONG_LIVED_ACCESS_TOKEN,
} from "../../keys";
import { fetchAdminConversationsIds, formatDate, formatTimeFromISO } from "../../utilities/helperFunctions";

export const getConversations = async (
  request: Request,
  response: Response
) => {
  try {
    const converse = await fetchAdminConversationsIds()

    if(!converse || converse.length === 0 || converse === undefined){
      return response.status(404).json({
        message: "No conversations found.",
        data: [],
      })
    }

    const conversationDetails = await await Promise.all(converse.map(async (chat:any)=>{
      const userChats = await axios.get(`${FETCH_ADMIN_CONVERSATIONS_DETAILS_URI}/${chat.id}?fields=messages&access_token=${MY_LONG_LIVED_ACCESS_TOKEN}`)
      return userChats.data.messages
       
    }))

    const details = await Promise.all(conversationDetails.flat().map(async (msg: any) => {
      const users = await Promise.all(msg.data.map(async (info: any) => {
        const userMessage = await axios.get(
          `${FETCH_ADMIN_CONVERSATIONS_DETAILS_URI}/${info.id}?fields=id,created_time,from,to,message&access_token=${MY_LONG_LIVED_ACCESS_TOKEN}`
        );
        return userMessage.data;
      }));
      return users;
    }));

    const chatDetails = await Promise.all(details.map(async (text:any)=>{
      const specifics = await Promise.all(text.map(async (messages:any)=> {

        let userId = messages.from.id != ADMIN_SCOPED_ID ? messages.from.id : null;
        
     return  {
        userId,
        userName: messages.from.username,
        message: messages.message,
        date: formatDate(messages.created_time),
        time: formatTimeFromISO(messages.created_time),
        }
      }))

      return specifics
    }))


    // const conversations = await axios.get(FETCH_CONVERSATIONS_URL);
    // if (
    //   !conversations.data.messages.data ||
    //   conversations.data.messages.data.length === 0 ||
    //   conversations.data.messages.data === undefined
    // ) {
    //   return response.status(404).json({
    //     message: "No conversations found.",
    //     data: [],
    //   });
    // }

    // const messages = conversations.data.messages.data;

    // const detailsPromises = messages.map(async (msg: any) => {
    //   const user_message = await axios.get(
    //     `${GET_MESSAGES_URL}/${msg.id}?fields=id,created_time,from,to,message&access_token=${MY_LONG_LIVED_ACCESS_TOKEN}`
    //   );

    //   return {
    //     userName: user_message.data.from.username,
    //     userId: user_message.data.from.id,
    //     message: user_message.data.message,
    //     date: formatDate(user_message.data.created_time),
    //     time: formatTimeFromISO(user_message.data.created_time),
    //   };
    // });

    // const details = await Promise.all(detailsPromises);

    return response.status(200).json({ data: chatDetails });
  } catch (error: any) {
    console.log('fetch user conversation error', error.response ? error.response.data : error.message)
    return response.status(500).json({ message: 'error, contact admin' });
  }
};
