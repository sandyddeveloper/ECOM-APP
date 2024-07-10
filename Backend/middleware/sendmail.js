import { createTransport } from 'nodemailer';


const sendMail = async (email, subject, text) =>{

    // config

const Trasport = createTransport({
    host : "smtp.gmail.com",
    port: 465,
    auth: {
        user : process.env.GMAIL,
        user : process.env.GPASSWORD,
        },
});

// send mail
await Trasport.sendMail({
    from : process.env.GMAIL,
    to : email,
    subject,
    text,
});
}


export default sendMail;