import express from "express";
import { RegistrationUser } from "../Controller/user";

const router = express.Router();

router.post("/User/Registration", RegistrationUser);


export default router;