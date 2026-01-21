import express from "express";
import { protect } from "..auth.middleware.js";
import {  
  createGig,
  getMyGigs,
  getOpenGigs,
} from "..gig.controller.js";

const router = express.Router();

/* CREATE GIG */
router.post("/", protect, createGig);

/* GET LOGGED-IN USER GIGS */
router.get("/my", protect, getMyGigs);

/* GET ALL OPEN GIGS (PUBLIC) */
router.get("/", getOpenGigs);

export default router;

