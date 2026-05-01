import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { BsClockHistory } from "react-icons/bs";

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

export default function History({ onReuse }) {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/convert/history");
      setHistory(data.data);
    } catch (error) {
      console.error("Error fetching history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchHistory();

    const listener = () => fetchHistory();
    window.addEventListener("historyUpdated", listener);

    return () => window.removeEventListener("historyUpdated", listener);
  }, [user]);

  if (!user) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BsClockHistory className="text-gold-500" />
          <h3 className="font-semibold text-gray-800 dark:text-white tracking-wider">
            HISTORY
          </h3>
        </div>
        <p className="text-center py-4 text-gray-500 dark:text-gray-400">
          Login to view your conversion history.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BsClockHistory className="text-gold-500" />
          <h3 className="font-semibold text-gray-800 dark:text-white tracking-wider">
            HISTORY
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
        <BsClockHistory className="text-gold-500" />
        <h3 className="font-semibold text-gray-800 dark:text-white tracking-wider">
          HISTORY
        </h3>
      </div>

      {history.length === 0 && (
        <p className="text-center py-4 text-gray-500 dark:text-gray-400">
          No conversions yet
        </p>
      )}

      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item._id}
            onClick={() => onReuse(item)}
            className="p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-zinc-700 
      hover:border-gold-500 hover:bg-gold-500/5 cursor-pointer transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {/* Main content */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2">
                <span className="text-lg">
                  {currencyFlags[item.from] || "💱"}
                </span>

                <span className="font-mono font-bold text-gray-800 dark:text-white text-sm sm:text-base">
                  {item.amount}
                </span>

                <span className="text-gray-400">→</span>

                <span className="text-lg">
                  {currencyFlags[item.to] || "💱"}
                </span>

                <span className="font-mono font-bold text-gold-500 text-sm sm:text-base">
                  {item.convertedAmount.toLocaleString()}
                </span>
              </div>

              {/* Date */}
              <span className="text-xs text-gray-400 sm:text-right">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
