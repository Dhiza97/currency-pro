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

          setData((prev) => {
            const updated = [
              ...prev,
              { time: new Date().toLocaleTimeString(), rate },
            ];
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
    <div className="mt-6 w-full">

      {/* Header (RESPONSIVE FIX) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">

        <h4 className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
          Live Rate Trend ({from} → {to})
        </h4>

        {/* Range buttons */}
        <div className="flex justify-center sm:justify-end gap-2 flex-wrap">
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

      {/* Loading */}
      {loading && (
        <p className="text-xs text-gray-400 mb-2 text-center sm:text-left">
          Updating...
        </p>
      )}

      {/* Empty State */}
      {data.length === 0 && !loading && (
        <p className="text-xs text-gray-400 text-center sm:text-left">
          No data available for this range
        </p>
      )}

      {/* Chart wrapper */}
      <div className="w-full overflow-x-hidden">

        <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 180 : 240}>
          <LineChart
            data={data}
            onMouseMove={(e) => {
              if (e && e.activeLabel) setHoverX(e.activeLabel);
            }}
            onMouseLeave={() => setHoverX(null)}
          >
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.08} />

            {/* X-axis: responsive label handling */}
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
              minTickGap={20}
            />

            <YAxis
              tick={{ fontSize: 10 }}
              width={40}
              domain={["auto", "auto"]}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px",
              }}
            />

            {hoverX && (
              <ReferenceLine
                x={hoverX}
                stroke="#888"
                strokeDasharray="3 3"
              />
            )}

            <Area
              type="monotone"
              dataKey="rate"
              stroke="none"
              fill="url(#colorRate)"
            />

            <Line
              type="monotone"
              dataKey="rate"
              stroke="#D4AF37"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}