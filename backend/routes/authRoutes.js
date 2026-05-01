import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  saveCurrencyPair,
  getSavedPairs,
  deleteSavedPair
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.post("/pairs", protect, saveCurrencyPair)
router.get("/pairs", protect, getSavedPairs)
router.delete("/pairs", protect, deleteSavedPair)

export default router;