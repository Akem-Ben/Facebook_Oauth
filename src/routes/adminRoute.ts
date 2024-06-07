import express from 'express';
import { registerUser } from '../controllers/userSignup';

const router = express.Router()


router.post('/signup', registerUser)




export default router;