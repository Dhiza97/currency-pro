import express from "express";
import rateLimit from "express-rate-limit";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  getProfile,
  updateProfile,
  saveCurrencyPair,
  getSavedPairs,
  deleteSavedPair,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  message: {
    success: false,
    message: "Too many attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/refresh", refreshTokens);
router.post("/logout", logoutUser);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login?error=google",
  }),
  (req, res) => {
    const { accessToken, refreshToken } = generateTokens(req.user._id);

    // Set httpOnly refresh cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend with access token in URL fragment (never query string)
    const params = new URLSearchParams({
      token: accessToken,
      name: req.user.name,
      email: req.user.email,
    });
    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback#${params.toString()}`,
    );
  },
);

// Profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Pairs
router.post("/pairs", protect, saveCurrencyPair);
router.get("/pairs", protect, getSavedPairs);
router.delete("/pairs", protect, deleteSavedPair);

// Bring in generateTokens (or move it to a shared util)
function generateTokens(userId) {
  const accessToken = jwt.sign(
    { id: userId, type: "access" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    { id: userId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
  return { accessToken, refreshToken };
}

export default router;
