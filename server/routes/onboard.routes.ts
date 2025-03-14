import { Router } from "express";
import { userOnboard } from "../controllers/onboard.controller";
import checkAuth from "../middlewares/auth.middleware";

const router = Router();

router.route("/user").post(checkAuth, userOnboard);

export default router;
