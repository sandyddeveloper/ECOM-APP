import { createTransport } from 'nodemailer';

const sendMail = async (email, subject, text) => {
    // config
    const transport = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.GMAIL,
            pass: process.env.GPASSWORD, // Note: use 'pass' instead of 'user' for the password field
        },
    });

    // send mail
    await transport.sendMail({
        from: process.env.GMAIL,
        to: email,
        subject,
        text,
    });
}

export default sendMail;
