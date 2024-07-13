import express from "express";
import { RegistrationUser, verifyUser, loginUser, myProfile } from '../Controller/user.js';
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post('/user/register', RegistrationUser);
router.post('/user/verify', verifyUser);
router.post('/user/login', loginUser);
router.get('/user/profile', isAuth, myProfile);

export default router;
