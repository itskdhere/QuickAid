import { Router } from "express";
import {
  userSignup,
  userSignin,
  userSignout,
} from "../controllers/auth.controller";

const router = Router();

router.route("/user/signup").post(userSignup);
router.route("/user/signin").post(userSignin);
router.route("/user/signout").get(userSignout);

export default router;
