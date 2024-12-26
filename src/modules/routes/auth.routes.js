import {Router} from "express";
import { checkUserExistence } from "../middlewares/auth.middlewares.js";
import { login, signUp, verifyEmail } from "../auth/credintials/credintials.auth.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { authValidationSchema } from "../validations/user.validations.js";

const authRouter = Router();

// login
authRouter.post("/login",checkUserExistence("login"),validate(authValidationSchema),login);

// sign up
authRouter.post("/signup",checkUserExistence("signUp"),validate(authValidationSchema),signUp);

// verify email
authRouter.get("/verify/:emailToken",verifyEmail);
export default authRouter