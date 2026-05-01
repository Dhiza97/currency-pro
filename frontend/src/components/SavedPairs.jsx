import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { BsStar, BsTrash } from "react-icons/bs";
import toast from "react-hot-toast";

const currencyFlags = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  CNY: "🇨🇳",
  INR: "🇮🇳",
  AUD: "🇦🇺",
  CAD: "🇨🇦",
  CHF: "🇨🇭",
  HKD: "🇭🇰",
  SGD: "🇸🇬",
  SEK: "🇸🇪",
  KRW: "🇰🇷",
  NOK: "🇳🇴",
  NZD: "🇳🇿",
  MXN: "🇲🇽",
  BRL: "🇧🇷",
  ZAR: "🇿🇦",
  RUB: "🇷🇺",
  TRY: "🇹🇷",
  NGN: "🇳🇬",
  AED: "🇦🇪",
  SAR: "🇸🇦",
  THB: "🇹🇭",
  MYR: "🇲🇾",
  PHP: "🇵🇭",
  IDR: "🇮🇩",
  VND: "🇻🇳",
  PKR: "🇵🇰",
  BDT: "🇧🇩",
};

export default function SavedPairs({ onSelectPair }) {
  const { user } = useContext(AuthContext);
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPairs = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/auth/pairs");
      setPairs(data.savedPairs);
    } catch (error) {
      console.error("Error fetching pairs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchPairs();

    const listener = () => fetchPairs();
    window.addEventListener("pairsUpdated", listener);

    return () => window.removeEventListener("pairsUpdated", listener);
  }, [user]);

  const handleDelete = async (from, to) => {
    try {
      await API.delete("/auth/pairs", {
        data: { from, to },
      });
      toast.success("Pair removed");
      fetchPairs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting pair");
    }
  };

  if (!user) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BsStar className="text-gold-500" />
          <h3 className="font-semibold text-gray-800 dark:text-white tracking-wider">
            FAVORITES
          </h3>
        </div>
        <p className="text-center py-4 text-gray-500 dark:text-gray-400">
          Login to save favorite pairs.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BsStar className="text-gold-500" />
          <h3 className="font-semibold text-gray-800 dark:text-white tracking-wider">
            FAVORITES
          </h3>
        </div>
        <p className="text-center py-4 text-gray-500 dark:text-gray-400">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <BsStar className="text-gold-500" />
        <h3 className="font-semibold text-gray-800 dark:text-white tracking-wider">
          FAVORITES
        </h3>
      </div>

      {pairs.length === 0 && (
        <p className="text-center py-4 text-gray-500 dark:text-gray-400">
          No favorite pairs yet
        </p>
      )}

      <div className="space-y-2">
        {pairs.map((pair) => (
          <div
            key={pair._id}
            className="p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-zinc-700 
      hover:border-gold-500 hover:bg-gold-500/5 transition-all"
          >
            <div className="flex items-center justify-between gap-3">
              {/* Select pair button */}
              <button
                onClick={() => onSelectPair(pair)}
                className="flex flex-wrap items-center gap-2 text-left"
              >
                <span className="text-lg">
                  {currencyFlags[pair.from] || "💱"}
                </span>

                <span className="font-mono font-bold text-gray-800 dark:text-white text-sm sm:text-base">
                  {pair.from}
                </span>

                <span className="text-gray-400">→</span>

                <span className="text-lg">
                  {currencyFlags[pair.to] || "💱"}
                </span>

                <span className="font-mono font-bold text-gray-800 dark:text-white text-sm sm:text-base">
                  {pair.to}
                </span>
              </button>

              {/* Delete button (always visible on mobile) */}
              <button
                onClick={() => handleDelete(pair.from, pair.to)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <BsTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}