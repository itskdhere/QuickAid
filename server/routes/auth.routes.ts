import { Router } from "express";
import checkAuth from "../middlewares/auth.middleware";
import {
  userGoogle,
  userGoogleCallback,
  userSignup,
  userSignin,
  userSignout,
  userWhoami,
} from "../controllers/auth.controller";

const router = Router();

router.route("/google").get(userGoogle);
router.route("/google/callback").get(userGoogleCallback);

router.route("/user/signup").post(userSignup);
router.route("/user/signin").post(userSignin);
router.route("/user/signout").get(checkAuth, userSignout);

router.route("/user/whoami").get(checkAuth, userWhoami);

export default router;
