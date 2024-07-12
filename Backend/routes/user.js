
import express from "express";
import { RegistrationUser, verifyUser, loginUser } from '../Controller/user.js';

const router = express.Router();

router.post('/user/register', RegistrationUser);
router.post('/user/verify', verifyUser);
router.post('/user/login', loginUser);

export default router;
