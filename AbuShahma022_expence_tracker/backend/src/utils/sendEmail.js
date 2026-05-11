import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
import CustomError from './customError.js';

const EmailUtility = async(EmailTo, EmailText, EmailSubject) => {

    try {
        const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // 2. Email details
    const mailOptions = {
      from: `"expense_tracker" <${process.env.EMAIL_USER}>`, // sender name + email
      to: EmailTo,         // recipient
      subject: EmailSubject, // subject
      html: EmailText       // email body (HTML)
    };

    return await transporter.sendMail(mailOptions);
        
    } catch (error) {
        console.error("Email sending error:", error);
      throw new CustomError(
      "problem in sending email",
      404
    );
        
    }
}
export default EmailUtility;