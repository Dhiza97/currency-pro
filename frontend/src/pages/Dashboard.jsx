import Navbar from "../components/Navbar";
import Converter from "../components/Converter";
import SavedPairs from "../components/SavedPairs";
import { useState } from "react";
import History from "../components/History";
import { BsCurrencyExchange } from "react-icons/bs";

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <BsCurrencyExchange className="text-gold-500" />
            Currency Exchange
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Convert currencies instantly with real-time rates
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Converter - Main Area */}
          <div className="lg:col-span-2">
            <Converter selectedPair={selectedPair} reuseData={reuseData} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="animate-slide-up stagger-1">
              <SavedPairs onSelectPair={handleSelectPair} />
            </div>
            <div className="animate-slide-up stagger-2">
              <History onReuse={handleReuse} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}