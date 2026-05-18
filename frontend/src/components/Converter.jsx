import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { PiArrowsHorizontalBold } from "react-icons/pi";
import { IoStarOutline, IoStar } from "react-icons/io5";
import { BsCalculator } from "react-icons/bs";
import CurrencySelect from "./CurrencySelect";
import toast from "react-hot-toast";
import RateChart from "./RateChart";

export default function Converter({ selectedPair, reuseData }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    from: "USD",
    to: "EUR",
    amount: "",
  });

  const [result, setResult] = useState(null);
  const [pairId, setPairId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleSavePair = async () => {
    if (!user) {
      toast.error("Please login to save favorite pairs.");
      navigate("/login");
      return;
    }
    try {
      await API.post("/auth/pairs", {
        from: form.from.toUpperCase(),
        to: form.to.toUpperCase(),
      });
      setIsFavorite(true);

      window.dispatchEvent(new Event("pairsUpdated"));
      toast.success("Pair saved!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving pair");
    }
  };

  const handleConvert = async () => {
    if (!form.amount) return toast.error("Enter amount");

    try {
      setLoading(true);

      let res;

      if (pairId) {
        res = await API.get(
          `/convert/pair?pairId=${pairId}&amount=${form.amount}&save=true`,
        );
      } else {
        res = await API.get(
          `/convert?from=${form.from}&to=${form.to}&amount=${form.amount}&save=true`,
        );
      }

      setResult(res.data.data);

      if (user) {
        window.dispatchEvent(new Event("historyUpdated"));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setForm((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
    setResult(null);
  };

  useEffect(() => {
    if (selectedPair) {
      setPairId(selectedPair._id);

      setForm((prev) => ({
        ...prev,
        from: selectedPair.from,
        to: selectedPair.to,
      }));
    }
  }, [selectedPair]);

  useEffect(() => {
    if (reuseData) {
      setForm({
        from: reuseData.from,
        to: reuseData.to,
        amount: reuseData.amount,
      });

      setPairId(null);
    }
  }, [reuseData]);

  return (
    <div className="card p-4 sm:p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5 sm:mb-6">
        <BsCalculator className="text-gold-500 text-xl" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white tracking-wider">
          CONVERTER
        </h2>
      </div>

      {/* Amount Input */}
      <div className="mb-5 sm:mb-6">
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">
          You Send
        </label>

        <input
          className="input text-right text-xl sm:text-2xl"
          placeholder="0.00"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
      </div>

      {/* Currency Selectors (RESPONSIVE FIX) */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-3 mb-6">
        <div className="w-full">
          <CurrencySelect
            value={form.from}
            onChange={(code) => setForm({ ...form, from: code })}
          />
        </div>

        {/* Swap button (mobile-friendly positioning) */}
        <button
          className="p-3 rounded-full bg-gold-500/10 hover:bg-gold-500/20 
          dark:hover:bg-gold-500/30 transition-all cursor-pointer hover:scale-110
          self-center sm:mt-5"
          onClick={handleSwap}
          title="Swap currencies"
        >
          <PiArrowsHorizontalBold className="text-gold-500 text-xl" />
        </button>

        <div className="w-full">
          <CurrencySelect
            value={form.to}
            onChange={(code) => setForm({ ...form, to: code })}
          />
        </div>
      </div>

      {/* Action Buttons (STACK ON MOBILE) */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 sm:py-2"
          onClick={handleConvert}
          disabled={loading}
        >
          {loading ? (
            <span className="animate-pulse text-sm sm:text-base">
              CONVERTING...
            </span>
          ) : (
            <span className="text-sm sm:text-base">CONVERT</span>
          )}
        </button>

        <button
          className={`p-3 rounded-xl transition-all self-center sm:self-auto ${
            isFavorite
              ? "bg-gold-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gold-500"
          }`}
          onClick={handleSavePair}
          title={user ? "Save pair" : "Login to save pairs"}
          disabled={!user}
          style={!user ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          {isFavorite ? <IoStar /> : <IoStarOutline />}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="animate-slide-up">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">
            You Receive
          </label>

          <div className="calculator-display text-right">
            <span className="text-2xl sm:text-3xl">
              {result.convertedAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-base sm:text-lg ml-2 opacity-70">
              {result.to}
            </span>
          </div>

          <p className="text-center mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            1 {result.from} ={" "}
            {(result.convertedAmount / result.amount).toFixed(4)} {result.to}
          </p>
        </div>
      )}

      <RateChart
        key={`${form.from}-${form.to}`}
        from={form.from}
        to={form.to}
      />
    </div>
  );
}
