import mongoose from "mongoose";
import chalk from "chalk";

export default async function connectDB() {
  console.log(chalk.yellow("Attempting to connect to MongoDB..."));
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}?retryWrites=true&w=majority`
    );
    console.log(
      chalk.green(
        `MongoDB connected to host: ${connectionInstance.connection.host}:${connectionInstance.connection.port}`
      )
    );
    return connectionInstance;
  } catch (error: any) {
    console.log(chalk.red("MongoDB Connection Error: ") + error);
    throw new Error(error);
  }
}
