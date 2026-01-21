
console.log("Bid routes loaded");

import express from "express";
import mongoose from "mongoose";
import Bid from "./bid.js";
import Gig from "./gig.js";
import { protect } from "./auth.middleware.js";

const router = express.Router();

/**
 * CREATE A BID (Freelancer)
 * POST /api/bids
 */
router.post("/", protect, async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot bid on your own gig" });
    }

    if (gig.status !== "open") {
      return res.status(400).json({ message: "Gig is not open for bidding" });
    }

   const bid = await Bid.create({
  gigId,
  bidderId: req.user._id,
  message,
  price
});

    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/my", protect, async (req, res) => {
  const bids = await Bid.find({ bidderId: req.user._id })
    .populate("gigId", "title status");

  res.json(bids);
});

/**
 * GET ALL BIDS FOR A GIG (Client only)
 * GET /api/bids/:gigId
 */
router.get("/:gigId", protect, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate("freelancerId", "name email");

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * HIRE A FREELANCER (CRITICAL LOGIC)
 * POST /api/bids/:bidId/hire
 */
router.post("/:bidId/hire", protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bid = await Bid.findById(req.params.bidId).session(session);
    if (!bid) {
      throw new Error("Bid not found");
    }

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      throw new Error("Gig not found");
    }

    // Authorization
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      throw new Error("Not authorized to hire for this gig");
    }

    // Prevent double hiring
    if (gig.status !== "open") {
      throw new Error("Gig already assigned");
    }

    // Hire selected bid
    bid.status = "hired";
    await bid.save({ session });

    // Reject other bids
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" },
      { session }
    );

    // Update gig
    gig.status = "assigned";
    await gig.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Freelancer hired successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
});



export default router;
