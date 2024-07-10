
import express from "express";
import RegistrationUser from '../Controller/user.js';

const router = express.Router();

router.post('/user/register', RegistrationUser);

export default router;
