import { CatchAsyncErrors } from "../../services/ErrorHandler.service.js";
import { sendEmail } from "../../utils/nodemailer/nodemailer.util.js";
import TaskModel from "../models/task.model.js";
import UserModel from "../models/user.model.js";

const deleteAllRelatedUserTasksAndGroups = CatchAsyncErrors(async(req, res, next) => {
  const user = req.user;
  const deleteUserTasks=await TaskModel.deleteMany({Creator:user.id});
  next();
})


const sendVerificationEmailOnEmailChange = CatchAsyncErrors(async(req, res, next) => {
  const user = req.user;
  if(req.body.Email===user.Email) return next();
  const updateUser=await UserModel.findOneAndUpdate({Email:user.Email,Verified:false});
  if(!updateUser) throw new AppError("Failed to provide verification email",400);
  sendEmail(req.body.Email,"ToDo Verification For Email Change");
  next();
})

export {deleteAllRelatedUserTasksAndGroups,sendVerificationEmailOnEmailChange};