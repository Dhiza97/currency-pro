import Navbar from "../components/Navbar";
import Converter from "../components/Converter";
import SavedPairs from "../components/SavedPairs";
import { useState } from "react";
import History from "../components/History";
import { BsCurrencyExchange } from "react-icons/bs";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [selectedPair, setSelectedPair] = useState(null);
  const [reuseData, setReuseData] = useState(null);

  const handleSelectPair = (pair) => {
    setReuseData(null);
    setSelectedPair(pair);
  };

  const handleReuse = (data) => {
    setSelectedPair(null);
    setReuseData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] transition-colors flex flex-col">
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <BsCurrencyExchange className="text-gold-500 text-xl sm:text-2xl" />
            Currency Exchange
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Convert currencies instantly with real-time rates
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <Converter selectedPair={selectedPair} reuseData={reuseData} />
          </div>

          <div className="space-y-5 sm:space-y-6">
            <SavedPairs onSelectPair={handleSelectPair} />
            <History onReuse={handleReuse} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}