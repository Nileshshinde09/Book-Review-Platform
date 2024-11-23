import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ACCESS_TOKEN_SECRET } from "../constants.js";
import { asyncHandler } from "../utils/asynchHandler.js";
import { ADMIN_EMAILS } from "../constants.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Unauthorized request");
    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    let user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    if (ADMIN_EMAILS.some((email) => email === user.email)) {
      if (!user.isAdmin) {
        user = await User.findByIdAndUpdate(
            decodedToken?._id, 
            { isAdmin: true }, 
            { new: true, select: "-password -refreshToken" } 
          );
      }
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
