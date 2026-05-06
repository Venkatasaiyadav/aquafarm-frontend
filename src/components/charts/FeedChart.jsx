// src/components/charts/FeedChart.jsx

/*
 📚 LEARN: Recharts Library
 
 Recharts makes charts easy in React.
 
 <LineChart>    → Line graphs
 <BarChart>     → Bar graphs
 <PieChart>     → Pie/Donut charts
 <AreaChart>    → Filled area charts
 
 Each chart needs:
 - data = array of objects
 - XAxis/YAxis = what to show on axes
 - Line/Bar = what to draw
 - Tooltip = popup on hover
*/

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import dayjs from "dayjs";

export default function FeedChart({ data }) {
  // Group feed data by date
  const groupedData = data.reduce((acc, entry) => {
    const existing = acc.find((d) => d.date === entry.feedDate);
    if (existing) {
      existing.total += entry.quantityKg;
    } else {
      acc.push({
        date: entry.feedDate,
        total: entry.quantityKg,
      });
    }
    return acc;
  }, []);

  // Sort by date and take last 14 days
  const chartData = groupedData
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-14)
    .map((d) => ({
      ...d,
      date: dayjs(d.date).format("DD/MM"),
    }));

  if (chartData.length === 0) {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 text-center">
        <p className="text-[#94A3B8]">No feed data to display charts</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 md:p-5">
      <h3 className="text-white font-semibold mb-4">
        📊 Daily Feed (Last 14 Days)
      </h3>

      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
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
                value: "kg",
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
              formatter={(value) => [`${value} kg`, "Feed"]}
            />
            <Bar
              dataKey="total"
              fill="#0EA5E9"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
