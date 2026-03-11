import mongoose from "mongoose";

const connectDB = () => {
  if (!process.env.MONGO_URI) {
    console.error("MongoDB connection error: MONGO_URI is missing or undefined.");
    return;
  }
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
};

export default connectDB;
