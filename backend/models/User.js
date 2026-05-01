import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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
        from: {
          type: String,
          required: true,
        },
        to: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);