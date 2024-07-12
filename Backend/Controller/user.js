import { User } from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendmail.js";

// New user Registration
export  const RegistrationUser = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password, contact } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        const otp = Math.floor(Math.random() * 1000000);

        // Create a new user 
        user = { name, email, hashedPassword, contact };
        console.log(user);

        const activateTokens = jwt.sign({ user, otp }, process.env.ACT_TOKENS, {
            expiresIn: "5m",
        });

        // Send mail to user
        const message = `Please verify your account using OTP. Your OTP is ${otp}`;
        await sendMail(email, "Welcome to Asst with sandyddeveloper", message);

        return res.status(200).json({
            message: "OTP successfully sent to your email",
            activateTokens,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const verifyUser = async (req, res) => {
    try {
        const { otp, activateTokens } = req.body;
        const verify = jwt.verify(activateTokens, process.env.ACT_TOKENS);
        if (!verify) {
            return res.status(400).json({ message: "OTP expired" });
        }
        if (verify.otp !== otp) {
            return res.status(400).json({ message: "Wrong OTP" });
        }

        await User.create({
            name: verify.user.name,
            email: verify.user.email,
            password: verify.user.hashedPassword,
            contact: verify.user.contact,
        });

        return res.status(200).json({
            message: "User verified and registered successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

//Login User
export const  loginUser = async (req, res)=>{
    try {
         const {email, password } = req.body;
        
         // Check User Email Address
         const user = await User.findOneAndUpdate({email})
         if(!user){
            return res.status(400).json({
                message:"Invalid Email or Password",
            })
         }

         //Check Password 
         const matchPassword = await bcrypt.compare(password, user.password);
         if(!matchPassword){
            return res.status(400).json({
                message:"Invalid Email & Password",
         });
        }

        //Generate Signed Token
        const token = jwt.sign({id : user.id})


    } catch (error) {
        return res.status(500).json({
            message:error.message,
        });
    }
};

// export default {RegistrationUser, loginUser}


//
//14:15 / 49:05