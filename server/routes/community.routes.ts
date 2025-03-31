import { Router } from "express";
import checkAuth from "../middlewares/auth.middleware.js";
import {
  getAllPosts,
  createPost,
  likePost,
} from "../controllers/community.controller.js";

const router = Router();

router.route("/posts").get(checkAuth, getAllPosts);

router.route("/posts").post(checkAuth, createPost);

router.route("/posts/:id/like").post(checkAuth, likePost);

export default router;
