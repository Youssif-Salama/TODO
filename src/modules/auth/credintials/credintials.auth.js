import { AppError, CatchAsyncErrors } from "../../../services/ErrorHandler.service.js";
import { comparePassword } from "../../../utils/bcrypt/bcrypt.utils.js";
import { decodeToken, makeToken } from "../../../utils/jwt/jwt.utils.js";
import { sendEmail } from "../../../utils/nodemailer/nodemailer.util.js";
import UserModel from "../../models/user.model.js";

// signUp
export const signUp=CatchAsyncErrors(async(req,res)=>{
  const {Email,Password}=req.body;
  const createUser=await UserModel.create({Email,Password});
  if (!createUser) throw new AppError("Failed to sign up",400);
  sendEmail(Email,"ToDo Verification Email");
  res.status(201).json({
    message:"Signed up successfully, check your email for verification",
  })
})

// login
export const login = CatchAsyncErrors(async (req, res) => {
  const { Email, Password } = req.body;
  const {googleId}=req.user;
  if(googleId) throw new AppError("You are already logged in with google",400);
  const user = await UserModel.findOne({ Email });
  if (!user) throw new AppError("User not found, please sign up", 400);
  const passwordCheck=comparePassword(Password,user.Password);
  if (!passwordCheck) throw new AppError("Invalid password", 400);
  const token= makeToken({id:user._id,Email:user.Email,UserName:user.UserName,createdAt:user.createdAt,Verified:user.Verified});
  req.user=user;
  res.status(200).json({
    message: "Signed in successfully",
    token,
  });
});


// verify email
export const verifyEmail=CatchAsyncErrors(async(req,res)=>{
  const {emailToken}=req.params;
  const decodedToken=await decodeToken(emailToken);
  if(!decodedToken) throw new AppError("Invalid token",498);
  const user=await UserModel.findOne({Email:decodedToken.email});
  if(!user) throw new AppError("User not found",400);
  user.Verified=true;
  await user.save();
  res.redirect(process.env.On_Verify_Redirection)
})