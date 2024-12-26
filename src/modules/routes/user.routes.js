import {Router} from "express";
import { attachDeleteQuery, attachGetQuery, attachUpdateQuery } from "../../middlewares/Attach.Query.js";
import UserModel from "../models/user.model.js";
import { filterMiddleware, selectMiddleware } from "../../middlewares/Features.middleware.js";
import { execute } from "../../middlewares/Execution.js";
import { authenticationMiddleware } from "../../middlewares/auth.middleware.js";
import { deleteAllRelatedUserTasksAndGroups, sendVerificationEmailOnEmailChange } from "../middlewares/user.middleware.js";
import taskRouter from "./task.routes.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { applyNewPasswordValidationSchema, updateValidationSchema } from "../validations/user.validations.js";
import { askForResetPassword, resetPasswordDo } from "../controllers/user.controller.js";

const userRouter=Router();

// get my account
userRouter.get("/",authenticationMiddleware,attachGetQuery(UserModel),selectMiddleware(),filterMiddleware("user"),execute(
  {
    status: 200,
    result: {
      message: "success"
    }
  },
  {
    status: 400,
    result: {
      message: "failed"
  }}
));

// update my account
userRouter.put("/",authenticationMiddleware,validate(updateValidationSchema),attachUpdateQuery(UserModel),filterMiddleware("user"),sendVerificationEmailOnEmailChange,execute(
  {
    status: 200,
    result: {
      message: "success"
    }
  },
  {
    status: 400,
    result: {
      message: "failed"
  }}
));

// delete my account
userRouter.delete("/",authenticationMiddleware,deleteAllRelatedUserTasksAndGroups,attachDeleteQuery(UserModel),filterMiddleware("user"),execute(
  {
    status: 200,
    result: {
      message: "success"
    }
  },
  {
    status: 400,
    result: {
      message: "failed"
  }}
));

// ask fro password reset
userRouter.post("/reset-password-ask",askForResetPassword);

// do password reset
userRouter.post("/password-reset-do",validate(applyNewPasswordValidationSchema),resetPasswordDo);


// merge with tasks
userRouter.use("/:id/tasks",taskRouter);

export default userRouter;