import Gig from "./gig.js";

/* ================= CREATE GIG ================= */
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: "All fields required" });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id, // 🔑 CRITICAL
    });

    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET MY GIGS ================= */
export const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({
      ownerId: req.user._id, // 🔑 THIS FIXES YOUR ISSUE
    }).sort({ createdAt: -1 });

    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET OPEN GIGS ================= */
export const getOpenGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ status: "open" })
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
