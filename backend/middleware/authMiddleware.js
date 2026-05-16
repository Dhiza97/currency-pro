import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(401);
    throw new Error(err.name === "TokenExpiredError" ? "Token expired" : "Invalid token");
  }

  // Reject refresh tokens used as access tokens
  if (decoded.type !== "access") {
    res.status(401);
    throw new Error("Invalid token type");
  }

  req.user = await User.findById(decoded.id).select("-password -loginAttempts -lockUntil");
  if (!req.user) {
    res.status(401);
    throw new Error("User no longer exists");
  }

  next();
});