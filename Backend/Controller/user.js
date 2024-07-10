// ../Controller/user.js
import { User } from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendmail.js";

const RegistrationUser = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password, contact, name } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(Math.random() * 1000000);

        // Create a new user instance
        user = new User({ name, email, password: hashedPassword, contact });
        await user.save();

        const activateTokens = jwt.sign({ user, otp }, process.env.ACT_TOKENS, {
            expiresIn: "5m",
        });

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

export default RegistrationUser;
