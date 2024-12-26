import { CatchAsyncErrors } from "../../../services/ErrorHandler.service.js";
import { makeToken } from "../../../utils/jwt/jwt.utils.js";
import UserModel from "../../models/user.model.js";

// on login success
export const addNewGoogleLoggedInUser= CatchAsyncErrors(async (req, res) => {
  const { email, name, googleId, accessToken } = req.data;
  // check if this email has a normal account
  const checkIfEmailUsed = await UserModel.findOne({ where: { email } });
  if (!checkIfEmailUsed) {
    const signUpNewUser = await UserModel.create({
      UserName: name,
      Email: email,
      googleId,
    });
    if (!signUpNewUser)
      throw new AppError("failed to signup with google", 400);
    const token = makeToken({ user: {
      id: signUpNewUser._id,
      Email: signUpNewUser.Email,
      UserName: signUpNewUser.UserName,
      createdAt: signUpNewUser.createdAt,
      googleId: signUpNewUser.googleId
    }, accessToken });
    res.status(201).json({ message: "signup success", token });
  } else {
    if (checkIfEmailUsed?.googleId) {
      // on found user exist with oauth then login him
      const token = makeToken({ user: checkIfEmailUsed, accessToken });
      res.status(200).json({ message: "login success", token });
    } else {
      // on found user exist with normal account
      res.json(
        400,
        "user already exist with normal account, please login with normal account"
      );
    }
  }
});