import jwt from 'jsonwebtoken';
import { APP_SECRET } from '.';

const JWT_SECRET = 'your_secret_key'; // Use a strong, secure key

export function signToken(payload: object): string {
  return jwt.sign(payload, APP_SECRET, { expiresIn: '60d' }); // Example expiry time of 60 days
}

export function verifyToken(access_token: string) {
  try {
        return jwt.verify(access_token, APP_SECRET)
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
}
