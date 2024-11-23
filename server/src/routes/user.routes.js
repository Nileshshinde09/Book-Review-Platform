import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  isUsernameUnique,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/signup").post(registerUser);

router.route("/login").post(loginUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/update-account").post(verifyJWT, updateAccountDetails);

router.route("/check-unique-username").get(isUsernameUnique);

export default router;
