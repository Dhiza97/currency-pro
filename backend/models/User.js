// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple nulls
    },
    avatar: {
      type: String,
    },
    preferredCurrency: {
      type: String,
      default: "USD",
    },
    notificationEnabled: {
      type: Boolean,
      default: false,
    },
    savedPairs: [
      {
        from: { type: String, required: true },
        to:   { type: String, required: true },
      },
    ],
    // Brute-force lockout
    loginAttempts: { type: Number, default: 0 },
    lockUntil:     { type: Date },
  },
  { timestamps: true },
);

// Virtual: is account currently locked?
userSchema.virtual("isLocked").get(function () {
  return this.lockUntil && this.lockUntil > Date.now();
});

// Constants
userSchema.statics.MAX_ATTEMPTS = 5;
userSchema.statics.LOCK_TIME = 15 * 60 * 1000; // 15 minutes

// Increment failed login counter, lock if threshold crossed
userSchema.methods.incrementLoginAttempts = async function () {
  // If a previous lock has expired, reset and start fresh
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({ $set: { loginAttempts: 1 }, $unset: { lockUntil: 1 } });
  }
  const update = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= this.constructor.MAX_ATTEMPTS) {
    update.$set = { lockUntil: new Date(Date.now() + this.constructor.LOCK_TIME) };
  }
  return this.updateOne(update);
};

export default mongoose.model("User", userSchema);