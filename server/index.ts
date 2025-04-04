import dotenv from "dotenv-safe";
if (process.env?.NODE_ENV !== "production") {
  dotenv.config({
    path: "../.env",
    example: "../.env.example",
  });
}

import chalk from "chalk";
import { SignalConstants } from "os";
import connectDB from "./db/connect";
import app from "./app";

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

async function connectWithRetry(retries = MAX_RETRIES): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    if (retries > 0) {
      console.log(
        chalk.yellow(
          `Failed to connect to database. Retrying in ${
            RETRY_DELAY / 1000
          } seconds... (${retries} attempts remaining)`
        )
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(retries - 1);
    } else {
      console.log(
        chalk.red(`Failed to connect to database after ${MAX_RETRIES} attempts`)
      );
      throw error;
    }
  }
}

await connectWithRetry();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  app.on("error", (err) => {
    console.log("ERR: " + err);
    throw err;
  });
  console.log(
    chalk.greenBright(`Express.js app listening at http://localhost:${PORT}`)
  );
});

process.on("SIGINT", signalHandler);
process.on("SIGTERM", signalHandler);
process.on("SIGQUIT", signalHandler);

function signalHandler(signal: SignalConstants) {
  console.log(chalk.bgRedBright(`Received ${signal}`));
}
