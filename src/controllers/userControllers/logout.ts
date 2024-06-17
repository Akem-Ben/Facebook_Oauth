import { Request, Response } from 'express';

export const logout = async (request: Request, response: Response) => {
  try {
    // Destroy the local session
    request.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return response.status(500).json({ message: 'Error destroying session' });
      }

      response.clearCookie('connect.sid');

    //   return response.status(200).json({
    //     message: 'Done'
    //   })

      // Optional: Log out from Facebook
      // Ensure you have saved the user's Facebook access token in the session or user object
      const accessToken = request.params.accessToken //|| null;
      if (accessToken) {
        const fbLogoutUrl = `https://www.facebook.com/logout.php?next=${encodeURIComponent('http://localhost:5173')}&access_token=${accessToken}`;
        response.redirect(fbLogoutUrl);
      } else {
        response.status(200).json({ message: 'Successfully logged out' });
      }
    });
  } catch (error: any) {
    console.log(error.message);
    return response.status(500).json({ message: 'Internal server error' });
  }
};
