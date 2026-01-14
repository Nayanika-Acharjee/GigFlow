import mongoose from "mongoose";

export default mongoose.model(
  "Bid",
  new mongoose.Schema({
    gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig" },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
    price: Number,
    status: {
      type: String,
      enum: ["pending", "hired", "rejected"],
      default: "pending"
    }
  }, { timestamps: true })
);
