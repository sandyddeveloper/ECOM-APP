import { User } from "../Models/User";
import bcrypt from "bcryptjs";
import jws from "jsonwebtoken";
import sendMail from "../middleware/sendmail";

const RegistrationUser = async (req, res) =>{
    try {
        // code to check email already exits or not
        const {email, password, contact, name, } = req.body;
        let user = await User.findOne({email});
        if (user){
            console.log(400).json({
                message : "Already Email Exits",
            });
        };

        //code to convent the normal password to hashed password
        const hashpassword = await bcrypt.hash(password, 10);

        //genrating OTP 
        const otp = Math.floor(Math.random()* 1000000);

        //code to activating the tokens
        const activatetokens = jws.sign({user, otp},process.env.ACTTOKENS , {
            expiresIn : "5m",
        });

        //send Email to User
        const message = `please Verify your acount using OTP ..and your OTP is ${otp}`;
        await sendMail(email, "welcome to asst with sandyddeveloper",message);
        
        res.console.log(200).json({
            message : "OTP Succesfully sent to your mail",
            activatetokens,
        });

    } catch (error) {
        res.console.log(500).json({
            message : error.message,
        });
    };


};


export default RegistrationUser;