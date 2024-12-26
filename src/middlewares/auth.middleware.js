import { AppError, CatchAsyncErrors } from "../services/ErrorHandler.service.js";
import { verifyToken } from "../utils/jwt/jwt.utils.js";

const authenticationMiddleware = CatchAsyncErrors(async(req, res, next) => {
  const {token}=req.headers;
  if(!token) throw new AppError("You are not logged in",401);
  const decodedToken=await verifyToken(token);
  if(!decodedToken) throw new AppError("Invalid token",498);
  req.user=decodedToken;
  next();
})


export {authenticationMiddleware};