import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  ReferenceLine,
} from "recharts";

export default function RateChart({ from, to }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("1D");
  const [hoverX, setHoverX] = useState(null);

  const rangeMap = {
    "1D": "1d",
    "7D": "7d",
    "1M": "1m",
  };

  useEffect(() => {
    let interval = null;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await API.get(
          `/convert/rates/history?from=${from}&to=${to}&range=${rangeMap[range]}`
        );

        const incoming = res?.data?.data || [];

        // Normalize + clean data
        const cleaned = incoming
          .filter((item) => item && item.rate)
          .map((item) => ({
            time:
              range === "1D"
                ? new Date(item.time).toLocaleTimeString()
                : new Date(item.time).toLocaleDateString(),
            rate: Number(item.rate),
          }));

        setData(cleaned);
      } catch (err) {
        console.error("Chart fetch error:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // LIVE UPDATES ONLY FOR 1D
    if (range === "1D") {
      interval = setInterval(async () => {
        try {
          const res = await API.get(
            `/convert?from=${from}&to=${to}&amount=1`
          );

          const rate =
            res?.data?.data?.convertedAmount /
            res?.data?.data?.amount;

          if (!rate) return;

          const newPoint = {
            time: new Date().toLocaleTimeString(),
            rate,
          };

          setData((prev) => {
            const updated = [...prev, newPoint];

            // Keep last 50 points
            return updated.slice(-50);
          });
        } catch (err) {
          console.error("Live update error:", err);
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [from, to, range]);

  return (
    <div className="mt-6">
      {/* Loading */}
      {loading && (
        <p className="text-xs text-gray-400 mb-2">Updating...</p>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm text-gray-500">
          Live Rate Trend ({from} → {to})
        </h4>

        <div className="flex gap-2">
          {["1D", "7D", "1M"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                range === r
                  ? "bg-gold-500 text-white"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-gold-500"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {data.length === 0 && !loading && (
        <p className="text-xs text-gray-400">
          No data available for this range
        </p>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={data}
          onMouseMove={(e) => {
            if (e && e.activeLabel) {
              setHoverX(e.activeLabel);
            }
          }}
          onMouseLeave={() => setHoverX(null)}
        >
          {/* Gradient */}
          <defs>
            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

          {/* Axes */}
          <XAxis dataKey="time" />
          <YAxis domain={["auto", "auto"]} />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#111",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
          />

          {/* Crosshair */}
          {hoverX && (
            <ReferenceLine
              x={hoverX}
              stroke="#888"
              strokeDasharray="3 3"
            />
          )}

          {/* Area */}
          <Area
            type="monotone"
            dataKey="rate"
            stroke="none"
            fill="url(#colorRate)"
          />

          {/* Line */}
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#D4AF37"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}