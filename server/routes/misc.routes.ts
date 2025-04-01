import { Router } from "express";
import checkAuth from "../middlewares/auth.middleware";
import { healthTips } from "../controllers/misc.controller";

const router = Router();

router.route("/tips").get(checkAuth, healthTips);

export default router;
