import mongoose from "mongoose";

export default mongoose.model(
"Gig",
new mongoose.Schema({
title : String,
describtion : String,
budget : Number,
ownerId:{type: mongoose.Schema.Types.ObjectId, ref:"User"},
status: { type: String, enum: ["open", "assigned"], default: "open" }
  }, { timestamps: true })
   
);
