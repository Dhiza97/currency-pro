import User from "../models//User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      preferredCurrency: user.preferredCurrency,
    },
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.preferredCurrency = req.body.preferredCurrency || user.preferredCurrency;

  user.notificationEnabled =
    req.body.notificationEnabled ?? user.notificationEnabled;

  const updatedUser = await user.save();

  res.json({
    success: true,
    user: updatedUser,
  });
});

export const saveCurrencyPair = asyncHandler(async (req, res) => {
  const { from, to } = req.body;

  if (!from || !to) {
    res.status(400);
    throw new Error("Both currencies are required");
  }

  const user = await User.findById(req.user._id);

  const exists = user.savedPairs.find(
    (pair) => pair.from === from && pair.to === to,
  );

  if (exists) {
    res.status(400);
    throw new Error("Pair already saved");
  }

  user.savedPairs.push({ from, to });

  await user.save();

  res.json({
    success: true,
    savedPairs: user.savedPairs,
  });
});

export const getSavedPairs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    savedPairs: user.savedPairs,
  });
});

export const deleteSavedPair = asyncHandler(async (req, res) => {
  const { from, to } = req.body;

  const user = await User.findById(req.user._id);

  user.savedPairs = user.savedPairs.filter(
    (pair) => !(pair.from === from && pair.to === to),
  );

  await user.save();

  res.json({
    success: true,
    savedPairs: user.savedPairs,
  });
});