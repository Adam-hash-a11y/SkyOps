import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI as string;

  try {
    await mongoose.connect(uri);
    console.log("Connected to local MongoDB successfully");
  } catch (err) {
    console.error("Connection error:", err);
  }
}
