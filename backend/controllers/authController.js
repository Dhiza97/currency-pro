import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helpers
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId, type: "access" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: userId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email address");
  }

  if (!PASSWORD_REGEX.test(password)) {
    res.status(400);
    throw new Error(
      "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character"
    );
  }

  const normalizedEmail = validator.normalizeEmail(email);

  if (await User.findOne({ email: normalizedEmail })) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12); // 12 rounds > 10

  const user = await User.create({
    name: validator.escape(name.trim()),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const { accessToken, refreshToken } = generateTokens(user._id);
  setRefreshCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    accessToken,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// Login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const normalizedEmail = validator.normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });

  // Constant-time gate — always check password even if user not found
  // (prevents user enumeration via timing attack)
  const dummyHash = "$2b$12$invalidhashpaddingtomakethisconsistent000000000000000";
  const passwordToCheck = user?.password || dummyHash;

  if (!user) {
    await bcrypt.compare(password, passwordToCheck);
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (user.isLocked) {
    const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
    res.status(423);
    throw new Error(`Account locked. Try again in ${minutesLeft} minute(s)`);
  }

  // Google-only account trying to use password
  if (!user.password) {
    res.status(401);
    throw new Error("This account uses Google Sign-In");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    await user.incrementLoginAttempts();
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Successful login — reset lockout counters
  if (user.loginAttempts > 0) {
    await user.updateOne({ $set: { loginAttempts: 0 }, $unset: { lockUntil: 1 } });
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  setRefreshCookie(res, refreshToken);

  res.json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      preferredCurrency: user.preferredCurrency,
      avatar: user.avatar,
    },
  });
});

// Token Refresh
export const refreshTokens = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    res.status(401);
    throw new Error("No refresh token");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    res.status(401);
    throw new Error("Invalid or expired refresh token");
  }

  if (decoded.type !== "refresh") {
    res.status(401);
    throw new Error("Invalid token type");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  setRefreshCookie(res, refreshToken);

  res.json({ success: true, accessToken });
});

// Logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ success: true, message: "Logged out" });
});

// Profile
export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error("User not found"); }

  user.preferredCurrency  = req.body.preferredCurrency  ?? user.preferredCurrency;
  user.notificationEnabled = req.body.notificationEnabled ?? user.notificationEnabled;

  const updated = await user.save();
  res.json({ success: true, user: updated });
});

// Saved Pairs
export const saveCurrencyPair = asyncHandler(async (req, res) => {
  const { from, to } = req.body;
  if (!from || !to) { res.status(400); throw new Error("Both currencies are required"); }

  const user = await User.findById(req.user._id);
  if (user.savedPairs.some((p) => p.from === from && p.to === to)) {
    res.status(409); throw new Error("Pair already saved");
  }

  user.savedPairs.push({ from, to });
  await user.save();
  res.json({ success: true, savedPairs: user.savedPairs });
});

export const getSavedPairs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, savedPairs: user.savedPairs });
});

export const deleteSavedPair = asyncHandler(async (req, res) => {
  const { from, to } = req.body;
  const user = await User.findById(req.user._id);
  user.savedPairs = user.savedPairs.filter((p) => !(p.from === from && p.to === to));
  await user.save();
  res.json({ success: true, savedPairs: user.savedPairs });
});