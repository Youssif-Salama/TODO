import nodemailer from "nodemailer";
import { verifyEmailTemplate } from "../../../assets/templates/verifyEmail.template.js";
import { makeToken } from "../jwt/jwt.utils.js";
import dotenv from 'dotenv';
import { resetPasswordEmail } from "../../../assets/templates/resetPasswordEmail.template.js";
import { GenerateOTP } from "../../services/Otp.service.js";
dotenv.config();


// create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Email_User,
    pass: process.env.Email_App_Pass,
  },
});

/**
 * Sends an email with a verification template.
 * @param {string} email - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @throws Will log an error if sending the email fails.
 */
export const sendEmail = async (email,subject) => {
  try {
    const emailToken=await makeToken({email});
    const mailOptions = {
      from: process.env.Email_User,
      to: email,
      subject,
      html:verifyEmailTemplate(emailToken,process.env.Base_Url)
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};



export const sendEmailReqForResetPassword = async (email) => {
  try {
    const otp=GenerateOTP(4);
    const resetPasswordToken=await makeToken({email,otp});
    const mailOptions = {
      from: process.env.Email_User,
      to: email,
      subject:"Reset Password Email (TODO)",
      html:resetPasswordEmail(resetPasswordToken,otp,`${process.env.Frontend_Link}/apply-new-password`)
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};