import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport";

const app: Application = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(passport.initialize());
// app.use(express.static("../client/dist"));

import authRoutes from "./routes/auth.routes";
app.use("/api/v1/auth", authRoutes);

export default app;
