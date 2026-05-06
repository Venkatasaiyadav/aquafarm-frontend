// src/components/growth/GrowthChart.jsx

/*
 📚 LEARN: Chart Component Variants
 
 We already have GrowthCurve.jsx in charts/ folder
 This GrowthChart.jsx is a WRAPPER that adds:
 - Summary cards above chart
 - Multiple chart types (weight, biomass, survival)
 - Tab switching between views
 
 GrowthChart (this) = Full growth analysis section
 GrowthCurve (charts/) = Just the line chart
*/

import { useState } from "react";
import dayjs from "dayjs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GrowthChart({ samples = [], pond = null }) {
  const [chartType, setChartType] = useState("weight");

  if (samples.length === 0) {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 text-center">
        <span className="text-5xl block mb-3">📈</span>
        <h3 className="text-white font-semibold mb-1">No Growth Data Yet</h3>
        <p className="text-[#94A3B8] text-sm">
          Add your first weekly growth sample to see charts
        </p>
      </div>
    );
  }

  // Prepare chart data sorted by date
  const chartData = [...samples]
    .sort((a, b) => new Date(a.sampleDate) - new Date(b.sampleDate))
    .map((s) => ({
      date: dayjs(s.sampleDate).format("DD/MM"),
      fullDate: dayjs(s.sampleDate).format("DD/MM/YYYY"),
      weight: s.avgWeightGrams,
      biomass: s.estimatedBiomass ? Math.round(s.estimatedBiomass) : null,
      survival: s.survivalRate,
      alive: s.estimatedAliveCount,
      recFeed: s.recommendedDailyFeedKg,
    }));

  // Calculate growth statistics
  const latestSample = chartData[chartData.length - 1];
  const previousSample =
    chartData.length >= 2 ? chartData[chartData.length - 2] : null;
  const weightGain = previousSample
    ? (latestSample.weight - previousSample.weight).toFixed(1)
    : 0;
  const avgDailyGrowth =
    chartData.length >= 2
      ? (
          (chartData[chartData.length - 1].weight - chartData[0].weight) /
          chartData.length
        ).toFixed(2)
      : 0;

  const chartConfigs = {
    weight: {
      label: "Weight (g)",
      dataKey: "weight",
      color: "#0EA5E9",
      unit: "g",
    },
    biomass: {
      label: "Biomass (kg)",
      dataKey: "biomass",
      color: "#22C55E",
      unit: "kg",
    },
    survival: {
      label: "Survival (%)",
      dataKey: "survival",
      color: "#F59E0B",
      unit: "%",
    },
  };

  const activeConfig = chartConfigs[chartType];

  return (
    <div className="space-y-4">
      {/* Growth Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard
          label="Current Weight"
          value={`${latestSample.weight}g`}
          trend={weightGain > 0 ? "up" : weightGain < 0 ? "down" : "flat"}
          trendValue={`${weightGain > 0 ? "+" : ""}${weightGain}g`}
        />
        <SummaryCard
          label="Avg Daily Growth"
          value={`${avgDailyGrowth}g/day`}
        />
        <SummaryCard
          label="Survival"
          value={`${latestSample.survival || "—"}%`}
          trend={latestSample.survival >= 85 ? "up" : "down"}
        />
        <SummaryCard
          label="Biomass"
          value={`${latestSample.biomass || "—"} kg`}
        />
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-1 bg-[#1E293B] rounded-xl p-1 border border-[#334155]">
        {Object.entries(chartConfigs).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setChartType(key)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all
              ${
                chartType === key
                  ? "bg-[#0EA5E9] text-white"
                  : "text-[#94A3B8] hover:text-white"
              }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
        <h3 className="text-white font-semibold mb-4">
          📈 {activeConfig.label} Over Time
        </h3>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id={`gradient-${chartType}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={activeConfig.color}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={activeConfig.color}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#F8FAFC",
                }}
                formatter={(value) => [
                  `${value} ${activeConfig.unit}`,
                  activeConfig.label,
                ]}
              />
              <Area
                type="monotone"
                dataKey={activeConfig.dataKey}
                stroke={activeConfig.color}
                strokeWidth={3}
                fill={`url(#gradient-${chartType})`}
                dot={{
                  fill: activeConfig.color,
                  strokeWidth: 2,
                  r: 5,
                  stroke: "#1E293B",
                }}
                activeDot={{
                  fill: activeConfig.color,
                  r: 7,
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Samples Table */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#94A3B8] border-b border-[#334155]">
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-right py-3 px-4">Weight</th>
              <th className="text-right py-3 px-4">Survival</th>
              <th className="text-right py-3 px-4">Biomass</th>
              <th className="text-right py-3 px-4">Rec. Feed</th>
              <th className="text-center py-3 px-4">Health</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row, i) => (
              <tr
                key={i}
                className="border-b border-[#334155]/50 hover:bg-[#334155]/20"
              >
                <td className="py-2.5 px-4 text-white">{row.fullDate}</td>
                <td className="py-2.5 px-4 text-right text-[#0EA5E9] font-mono font-bold">
                  {row.weight}g
                </td>
                <td className="py-2.5 px-4 text-right text-[#94A3B8] font-mono">
                  {row.survival}%
                </td>
                <td className="py-2.5 px-4 text-right text-[#22C55E] font-mono">
                  {row.biomass} kg
                </td>
                <td className="py-2.5 px-4 text-right text-[#F59E0B] font-mono">
                  {row.recFeed} kg
                </td>
                <td className="py-2.5 px-4 text-center">
                  {samples[samples.length - 1 - i]?.healthStatus ===
                    "HEALTHY" && "🟢"}
                  {samples[samples.length - 1 - i]?.healthStatus ===
                    "MILD_ISSUE" && "🟡"}
                  {samples[samples.length - 1 - i]?.healthStatus ===
                    "DISEASE" && "🔴"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, trend, trendValue }) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-center">
      <p className="text-[#94A3B8] text-[10px] uppercase tracking-wide">
        {label}
      </p>
      <p className="text-white font-bold text-lg font-mono mt-0.5">{value}</p>
      {trend && (
        <p
          className={`text-xs mt-0.5 
          ${trend === "up" ? "text-green-400" : ""}
          ${trend === "down" ? "text-red-400" : ""}
          ${trend === "flat" ? "text-[#94A3B8]" : ""}
        `}
        >
          {trend === "up" && "↑"}
          {trend === "down" && "↓"}
          {trendValue && ` ${trendValue}`}
        </p>
      )}
    </div>
  );
}
