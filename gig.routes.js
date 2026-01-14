import express from "express";
import Gig from "./gig.js";
import { protect } from "./auth.middleware.js";

const router = express.Router();

// CREATE GIG (protected)
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id,
    });

    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET OPEN GIGS (public)
router.get("/", async (req, res) => {
  const gigs = await Gig.find({ status: "open" });
  res.json(gigs);
});

export default router;
