// src/components/charts/GrowthCurve.jsx

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import dayjs from "dayjs";

export default function GrowthCurve({ data }) {
  // Prepare chart data — sort by date ascending
  const chartData = [...data]
    .sort((a, b) => new Date(a.sampleDate) - new Date(b.sampleDate))
    .map((sample) => ({
      date: dayjs(sample.sampleDate).format("DD/MM"),
      weight: sample.avgWeightGrams,
      biomass: sample.estimatedBiomass
        ? Math.round(sample.estimatedBiomass)
        : null,
      survival: sample.survivalRate,
    }));

  // Expected growth curve for Vannamei
  const expectedData = [
    { day: "0", expected: 0 },
    { day: "30", expected: 5 },
    { day: "60", expected: 15 },
    { day: "90", expected: 25 },
    { day: "120", expected: 35 },
  ];

  if (chartData.length === 0) {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 text-center">
        <span className="text-4xl block mb-2">📈</span>
        <p className="text-[#94A3B8]">
          No growth samples yet. Add your first sample!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Weight Growth Chart */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 md:p-5">
        <h3 className="text-white font-semibold mb-4">
          📈 Weight Growth Curve
        </h3>

        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                axisLine={{ stroke: "#334155" }}
              />
              <YAxis
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                axisLine={{ stroke: "#334155" }}
                label={{
                  value: "grams",
                  position: "insideLeft",
                  fill: "#94A3B8",
                  fontSize: 12,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#F8FAFC",
                }}
                formatter={(value, name) => {
                  if (name === "weight") return [`${value}g`, "Weight"];
                  return [value, name];
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#0EA5E9"
                strokeWidth={3}
                dot={{
                  fill: "#0EA5E9",
                  strokeWidth: 2,
                  r: 5,
                }}
                activeDot={{
                  fill: "#0EA5E9",
                  strokeWidth: 0,
                  r: 7,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Growth Summary Cards */}
      {chartData.length >= 2 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard
            label="Latest Weight"
            value={`${chartData[chartData.length - 1].weight}g`}
          />
          <SummaryCard
            label="Weight Gain"
            value={`+${(
              chartData[chartData.length - 1].weight -
              chartData[chartData.length - 2].weight
            ).toFixed(1)}g`}
          />
          <SummaryCard
            label="Survival"
            value={`${chartData[chartData.length - 1].survival}%`}
          />
          <SummaryCard
            label="Biomass"
            value={`${chartData[chartData.length - 1].biomass} kg`}
          />
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-center">
      <p className="text-[#94A3B8] text-[10px] uppercase">{label}</p>
      <p className="text-white font-bold text-lg font-mono mt-0.5">{value}</p>
    </div>
  );
}
