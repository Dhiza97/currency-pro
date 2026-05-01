import { useState, useEffect, useRef } from "react";
import API from "../api/axios";
import { BsChevronDown } from "react-icons/bs";

// Currency code to flag emoji mapping
const currencyFlags = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", CNY: "🇨🇳",
  INR: "🇮🇳", AUD: "🇦🇺", CAD: "🇨🇦", CHF: "🇨🇭", HKD: "🇭🇰",
  SGD: "🇸🇬", SEK: "🇸🇪", KRW: "🇰🇷", NOK: "🇳🇴", NZD: "🇳🇿",
  MXN: "🇲🇽", BRL: "🇧🇷", ZAR: "🇿🇦", RUB: "🇷🇺", TRY: "🇹🇷",
  NGN: "🇳🇬", AED: "🇦🇪", SAR: "🇸🇦", THB: "🇹🇭", MYR: "🇲🇾",
  PHP: "🇵🇭", IDR: "🇮🇩", VND: "🇻🇳", PKR: "🇵🇰", BDT: "🇧🇩",
  EGP: "🇪🇬", KES: "🇰🇪", GHS: "🇬🇭", TZS: "🇹🇿", UGX: "🇺🇬",
  MAD: "🇲🇦", KWD: "🇰🇼", QAR: "🇶🇦", BHD: "🇧🇭", OMR: "🇴🇲",
  JOD: "🇯🇴", ILS: "🇮🇱", PLN: "🇵🇱", CZK: "🇨🇿", HUF: "🇭🇺",
  RON: "🇷🇴", BGN: "🇧🇬", HRK: "🇭🇷", ISK: "🇮🇸", RSD: "🇷🇸"
};

// Common currencies to show at top
const popularCurrencies = ["USD", "EUR", "GBP", "NGN", "JPY", "CNY", "AUD", "CAD"];

export default function CurrencySelect({ value, onChange }) {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const { data } = await API.get("/exchange");
        setCurrencies(data.currencies || []);
      } catch (error) {
        console.error("Error fetching currencies:", error);
        setCurrencies(popularCurrencies.map(code => ({ code, name: code })));
      } finally {
        setLoading(false);
      }
    };
    fetchCurrencies();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCurrencies = currencies.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Show all currencies in alphabetical order
  const sortedCurrencies = [...filteredCurrencies].sort((a, b) => 
    a.code.localeCompare(b.code)
  );

  const selectedCurrency = currencies.find(c => c.code === value) || { code: value, name: value };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input flex items-center justify-between hover:border-gold-500"
      >
        <span className="flex items-center gap-2">
          <span className="text-xl">{currencyFlags[value] || "💱"}</span>
          <span className="font-mono font-bold">{selectedCurrency.code}</span>
        </span>
        <BsChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden animate-fade-in">
          <div className="p-2 border-b border-gray-100 dark:border-zinc-800">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input mb-0 text-sm py-2"
              autoFocus
            />
          </div>
          
          <div className="overflow-y-auto max-h-56">
            {loading ? (
              <p className="p-4 text-center text-gray-500">Loading...</p>
            ) : sortedCurrencies.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No currencies found</p>
            ) : (
              sortedCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => {
                    onChange(currency.code);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${
                    value === currency.code ? "bg-gold-500/10" : ""
                  }`}
                >
                  <span className="text-2xl">{currencyFlags[currency.code] || "💱"}</span>
                  <span className="font-mono font-bold text-gray-800 dark:text-white">{currency.code}</span>
                  <span className="text-xs text-gray-400 truncate">{currency.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}