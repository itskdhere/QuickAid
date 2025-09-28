import { Router } from "express";
import checkAuth from "../middlewares/auth.middleware";
import {
  userGoogle,
  userGoogleCallback,
  userSignup,
  userSignin,
  userSignout,
  userWhoami,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

router.route("/google").get(userGoogle);
router.route("/google/callback").get(userGoogleCallback);

router.route("/user/signup").post(userSignup);
router.route("/user/signin").post(userSignin);
router.route("/user/signout").get(checkAuth, userSignout);

router.route("/user/whoami").get(checkAuth, userWhoami);

router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

export default router;
