
import express from "express";
import RegistrationUser, { verifyUser } from '../Controller/user.js';

const router = express.Router();

router.post('/user/register', RegistrationUser);
router.post('/user/verify', verifyUser);

export default router;
