import { getRates } from "../services/exchangeService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Conversion from "../models/Conversion.js";
import User from "../models/User.js";

export const convertCurrency = asyncHandler(async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    res.status(400);
    throw new Error("From, to and amount are required");
  }

  const numericAmount = Number(amount);

  if (isNaN(numericAmount)) {
    res.status(400);
    throw new Error("Amount must be a number");
  }

  const baseCurrency = from.toUpperCase();
  const targetCurrency = to.toUpperCase();

  const data = await getRates(baseCurrency);
  const rate = data.rates[targetCurrency];

  if (!rate) {
    res.status(400);
    throw new Error("Invalid target currency");
  }

  const convertedAmount = Number((numericAmount * rate).toFixed(2));

  // Only save conversion if user is authenticated
  const shouldSave = req.query.save === "true";

  if (shouldSave && req.user?._id) {
    await Conversion.create({
      from: baseCurrency,
      to: targetCurrency,
      amount: numericAmount,
      convertedAmount,
      rate,
      user: req.user._id,
    });
  }

  res.json({
    success: true,
    data: {
      from,
      to,
      amount: numericAmount,
      convertedAmount,
    },
  });
});

export const convertWithSavedPair = asyncHandler(async (req, res) => {
  const { pairId, amount } = req.query;

  if (!pairId || !amount) {
    res.status(400);
    throw new Error("pairId and amount are required");
  }

  const numericAmount = Number(amount);

  if (isNaN(numericAmount)) {
    res.status(400);
    throw new Error("Amount must be a number");
  }

  const user = await User.findById(req.user._id).select("savedPairs");

  const pair = user.savedPairs.id(pairId);

  if (!pair) {
    res.status(400);
    throw new Error("Saved pair not found");
  }

  const baseCurrency = pair.from;
  const targetCurrency = pair.to;

  const data = await getRates(baseCurrency);

  const rate = data.rates[targetCurrency];

  if (!data.rates[targetCurrency]) {
    res.status(400);
    throw new Error("Invalid target currency");
  }

  const convertedAmount = Number((numericAmount * rate).toFixed(2));

  res.json({
    success: true,
    data: {
      from: baseCurrency,
      to: targetCurrency,
      amount: numericAmount,
      convertedAmount,
      pairId,
    },
  });
});
