import mongoose from "mongoose";

export const connectDB = async () => {
  console.log("MONGO_URI =", process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");
};
