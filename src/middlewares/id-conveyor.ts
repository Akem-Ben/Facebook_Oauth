import {NextFunction, Request, Response} from 'express';
import { JwtPayload } from 'jsonwebtoken';

export const conveyor = (next:NextFunction, request:JwtPayload, response:Response) => {
    try{
        const user = request.session.user
        request.user = user
        next()
    }catch(error:any){
        console.log(error.message)
    }
}
