import {Request, Response} from 'express';
import { sendMessages } from './sendMessages';
import { emitMessage } from '../../app';

export const sendMessagesEndpoint = async (request: Request, response: Response) => {
    try {
        const usermessage = request.body.message;

        const userId = request.body.userId;
        const data = await sendMessages(usermessage, userId);
        if(data === 'error'){
            return response.status(400).json({message: 'Error sending message'})
        }
        emitMessage(usermessage);
        return response.status(200).json({message: 'Message sent successfully'})
    } catch (error: any) {
        console.log(error.response.data);
    }
}