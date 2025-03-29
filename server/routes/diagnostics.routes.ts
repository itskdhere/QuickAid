import { Router } from "express";
import checkAuth from "../middlewares/auth.middleware";
import {
  diagnosticsPredict,
  diagnosticsInfo,
} from "../controllers/diagnostics.controller";

const diagnostics = Router();

diagnostics.route("/predict").post(checkAuth, diagnosticsPredict);
diagnostics.route("/info").post(checkAuth, diagnosticsInfo);

export default diagnostics;
