import dotenv from "dotenv";
dotenv.config();

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
