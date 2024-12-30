import { AppError, CatchAsyncErrors } from "../../services/ErrorHandler.service.js";
import { decodeToken } from "../../utils/jwt/jwt.utils.js";
import { sendEmailReqForResetPassword } from "../../utils/nodemailer/nodemailer.util.js";
import UserModel from "../models/user.model.js";

// ask for reset password
export const askForResetPassword=CatchAsyncErrors(async(req,res)=>{
  const {Email}=req.body;
  const checkUserExistence=await UserModel.findOne({Email});
  if(!checkUserExistence) throw new AppError("No User with this email found!",400);
  // send email
  await sendEmailReqForResetPassword(Email);
  res.json(200,{
    message:"Email was sent successfully"
  })
})

// do reset password
export const resetPasswordDo=CatchAsyncErrors(async(req,res)=>{
  const {resetPasswordToken,otp,newPassword}=req.body;
  const decodedToken=await decodeToken(resetPasswordToken);
  if(otp!=decodedToken.otp)throw new AppError("wrong otp",400);
  const updateUser=await UserModel.findOneAndUpdate({Email:decodedToken.email},{Password:newPassword});
  if(!updateUser) throw new AppError("Failed to reset password",400);
  res.json(200,{
    message:"Password was reset successfully"
  })
})
