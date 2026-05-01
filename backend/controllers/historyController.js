import axios from "axios";
import Conversion from "../models/Conversion.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";
import { getCache, setCache } from "../utils/cache.js";

export const getConversionHistory = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const history = await Conversion.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    count: history.length,
    data: history,
  });
});

export const getRateHistory = async (req, res) => {
  const { from, to, range } = req.query;

  // Create cache key based on params
  const cacheKey = `rate:history:${from}:${to}:${range}`;

  // Try to get from cache first (short TTL for live rates)
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({ success: true, data: cached, cached: true });
  }

  const today = new Date();
  let startDate = new Date();

  if (range === "7d") startDate.setDate(today.getDate() - 7);
  else if (range === "1m") startDate.setMonth(today.getMonth() - 1);
  else startDate.setDate(today.getDate() - 1);

  const formatDate = (d) => d.toISOString().split("T")[0];

  // Ensure startDate is before today
  if (formatDate(startDate) >= formatDate(today)) {
    startDate.setDate(today.getDate() - 1);
  }

  try {
    const url = `https://api.frankfurter.app/${formatDate(startDate)}..${formatDate(today)}?from=${from}&to=${to}`;

    const response = await axios.get(url);

    if (!response.data || !response.data.rates) {
      return res.json({ success: true, data: [] });
    }

    const formatted = Object.entries(response.data.rates)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, value]) => ({
        time: date,
        rate: value?.[to] || 0,
      }));

    // Cache the result (5 min for historical, 1 min for 1D)
    const ttl = range === "1d" ? 60 : 300;
    await setCache(cacheKey, formatted, ttl);

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error("Frankfurter error:", err.response?.status, err.message);

    return res.json({
      success: true,
      data: [],
    });
  }
};