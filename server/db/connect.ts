import mongoose from "mongoose";
import { DB_NAME } from "../constants.ts";

const connectDB = async () => {
  console.log("Connecting to MongoDB...");
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB connected to host: ${connectionInstance.connection.host}:${connectionInstance.connection.port}`
    );
    return connectionInstance;
  } catch (error) {
    console.log("MongoDB Connection Error: " + error);
    process.exit(1);
  }
};

export default connectDB;
