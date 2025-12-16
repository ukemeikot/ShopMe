import mongoose from 'mongoose';
import { ENV } from "./env.js";

export const connectDatabase = async () => {
  // 1. Check current connection state
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState >= 1) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    console.log("Attempting to connect with URI length:", ENV.DB_URL ? ENV.DB_URL.length : "UNDEFINED");

    // 2. Connect if not connected
    const conn = await mongoose.connect(ENV.DB_URL, {
      tlsAllowInvalidCertificates: true,
    });

    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    // 3. In Serverless, avoid process.exit() if possible, but for fatal errors:
    process.exit(1); 
  }
};