import mongoose from "mongoose";

const conversionSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    convertedAmount: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Conversion", conversionSchema);
