import jwt from "jsonwebtoken";
import { User } from "../Models/User.js";

export const isAuth = async (res, req, next) =>{
    try {
        const token = req.token.header();
        if(!token){
            return res.status(403).json({messsage:"Please Loginto Go next"})
        };
        //Decoding the token and save in db
        const Decoding = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(Decoding._id)
        next();
    } catch (error) {
        return res.status(500).json({
            messsage:error.messsage,
        })
    }
}