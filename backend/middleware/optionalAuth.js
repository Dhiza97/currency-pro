import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.type === "access") {
        const user = await User.findById(decoded.id)
          .select("-password -loginAttempts -lockUntil");

        if (user) {
          req.user = user;
        }
      }
    }
  } catch {
    // Ignore invalid or expired tokens for guest requests
  }

  next();
};