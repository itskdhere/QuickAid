import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "PORT",
  "CORS_ORIGIN",
  "NODE_ENV",
  "JWT_SECRET",
  "MONGODB_URI",
  "AI_API_ENDPOINT",
  "AI_API_TOKEN",
  "GOOGLE_GENERATIVE_AI_API_KEY",
  "GOOGLE_MAPS_API_KEY",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is missing`);
  }
});

import connectDB from "./db/connect";
import app from "./app";

const PORT = process.env.PORT || 3500;

await connectDB();

app.listen(PORT, () => {
  app.on("error", (err) => {
    console.log("ERR: " + err);
    throw err;
  });
  console.log(`Express.js app listening at http://localhost:${PORT}`);
});
