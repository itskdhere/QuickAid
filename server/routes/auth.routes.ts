import { Router } from "express";
import checkAuth from "../middlewares/auth.middleware";
import {
  userSignup,
  userSignin,
  userSignout,
  userWhoami,
  updateUserProfile,
} from "../controllers/auth.controller";

const router = Router();

router.route("/user/signup").post(userSignup);
router.route("/user/signin").post(userSignin);
router.route("/user/signout").get(checkAuth, userSignout);

router.route("/user/whoami").get(checkAuth, userWhoami);
router.route("/user/update-profile").put(checkAuth, updateUserProfile);

export default router;
