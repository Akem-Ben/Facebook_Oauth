import http from 'http';


export const instagramRedirect = (request: http.IncomingMessage, response: http.ServerResponse) => {
    try {
    // const REDIRECT_URI = 'http://localhost:3030/insta/auth/instagram/callback';
    // `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`
      response.statusCode = 302;
      response.setHeader('Location', 'https://beat-tech-blog.vercel.app/');
      response.end();
    } catch (error: any) {
      console.log(error.message);
    }
  };