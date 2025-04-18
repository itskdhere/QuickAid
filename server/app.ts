import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import initializePassport from "./config/passport";
const passport = await initializePassport();

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

import onboardRoutes from "./routes/onboard.routes";
app.use("/api/v1/onboard", onboardRoutes);

import accountRoutes from "./routes/account.routes";
app.use("/api/v1/account", accountRoutes);

import diagnostics from "./routes/diagnostics.routes";
app.use("/api/v1/diagnostics", diagnostics);

import nearby from "./routes/nearby.routes";
app.use("/api/v1/nearby", nearby);

import community from "./routes/community.routes";
app.use("/api/v1/community", community);

import misc from "./routes/misc.routes";
app.use("/api/v1/misc", misc);

export default app;
