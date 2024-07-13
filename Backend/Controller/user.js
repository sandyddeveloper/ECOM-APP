import { User } from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendmail.js";

// New user Registration
export const RegistrationUser = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const { name, email, password, contact } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password:", hashedPassword);
        const otp = Math.floor(Math.random() * 1000000);

        // Create a new user object
        user = { name, email, password: hashedPassword, contact };
        console.log("New User Object:", user);

        const activateTokens = jwt.sign({ user, otp }, process.env.ACT_TOKENS, { expiresIn: "5m" });

        // Send mail to user
        const message = `Please verify your account using OTP. Your OTP is ${otp}`;
        await sendMail(email, "Welcome to Asst with sandyddeveloper", message);

        return res.status(200).json({ message: "OTP successfully sent to your email", activateTokens });
    } catch (error) {
        console.error("Error in Registration:", error);
        return res.status(500).json({ message: error.message });
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
            password: verify.user.password,
            contact: verify.user.contact,
        });

        return res.status(200).json({ message: "User verified and registered successfully" });
    } catch (error) {
        console.error("Error in Verify User:", error);
        return res.status(500).json({ message: error.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check User Email Address
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // Check Password
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // Generate Signed Token
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: "15d" });

        // Exclude the password field before sending the response
        const { password: userPassword, ...userDetails } = user.toObject();

        return res.status(200).json({ message: "Welcome " + user.name, token, userDetails });
    } catch (error) {
        console.error("Error in Login:", error);
        return res.status(500).json({ message: error.message });
    }
};

// User Profile Verification
export const myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error in myProfile:", error);
        return res.status(500).json({ message: error.message });
    }
};
