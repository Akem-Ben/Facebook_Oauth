
import { Request, Response } from 'express';

export const facebookRedirect = (request: Request, response: Response) => {
    try {
      const REDIRECT_URI = 'http://localhost:5173/profile';
      response.redirect(REDIRECT_URI);
    } catch (error: any) {
      console.log(error.message);
    }
};

//http://localhost:3030/auth/instagram