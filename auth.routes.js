import express from "express";
import {
  register,
  login,
  logout,
  getMe
} from "./auth.js";
import { protect } from "./auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post("/register", async (req, res, next) => {
  try {
    await register(req, res);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", async (req, res, next) => {
  try {
    await login(req, res);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post("/logout", logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get logged-in user
 * @access  Private
 */
router.get("/me", protect, getMe);

export default router;
