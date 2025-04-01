import { Router } from "express";
import checkAuth from "../middlewares/auth.middleware";
import {
  viewUserAccount,
  updateUserAccount,
  deleteUserAccount,
} from "../controllers/account.controller";

const router = Router();

router.route("/user/view").get(checkAuth, viewUserAccount);
router.route("/user/update").put(checkAuth, updateUserAccount);
router.route("/user/delete").delete(checkAuth, deleteUserAccount);

export default router;
