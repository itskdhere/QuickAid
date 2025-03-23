import { Router } from "express";
import checkAuth from "../middlewares/auth.middleware";
import { userOnboard } from "../controllers/onboard.controller";

const router = Router();

router.route("/user").post(checkAuth, userOnboard);

export default router;
