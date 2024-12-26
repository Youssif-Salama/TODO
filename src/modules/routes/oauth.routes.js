import { Router } from "express";
import { callBackGoogleLogin, loginWithGoogle } from "../auth/oauth/google.controllers.js";
import { addNewGoogleLoggedInUser } from "../auth/oauth/google.oauth.controllers.js";
import passport from "passport";


const googleOauthRouter = Router();

// login with google
googleOauthRouter.get("/google",loginWithGoogle);

googleOauthRouter.get("/google/callback",
  passport.authenticate("google",{session: false ,failureRedirect:"/"})
  ,callBackGoogleLogin,addNewGoogleLoggedInUser);

export default googleOauthRouter