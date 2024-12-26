import { AppError, CatchAsyncErrors } from "../../services/ErrorHandler.service.js";
import UserModel from "../models/user.model.js";

/**
 * A middleware that checks if a user already exists in the database
 * @param {string} forWhat - The type of operation to check for, either "signUp" or "signIn".
 * @returns {import('express').RequestHandler} - An express middleware function
 * @throws {AppError} - 400 Bad Request with the respective error message
 */
export const checkUserExistence = (forWhat) => {
  return CatchAsyncErrors(async (req, res, next) => {
    const { Email } = req.body;

    const findUser = await UserModel.findOne({ Email });

    if (findUser) {
      req.user = findUser;
    }

    if (forWhat === "login" && !findUser) {
      throw new AppError("User not found, please sign up", 400);
    }

    if (forWhat === "signUp" && findUser) {
      throw new AppError("Email already exists", 400);
    }

    next();
  });
};
