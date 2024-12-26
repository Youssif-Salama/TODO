import {Router} from "express";
import googleOauthRouter from "../modules/routes/oauth.routes.js";
import authRouter from "../modules/routes/auth.routes.js";
import userRouter from "../modules/routes/user.routes.js";
import taskRouter from "../modules/routes/task.routes.js";

const v1Router=Router();

v1Router.use("/oauth",googleOauthRouter);
v1Router.use("/auth",authRouter);
v1Router.use("/user",userRouter);
v1Router.use("/task",taskRouter);

export default v1Router