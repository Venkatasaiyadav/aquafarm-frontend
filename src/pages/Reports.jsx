// src/pages/Reports.jsx

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { dashboardAPI, expenseAPI } from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const EXPENSE_COLORS = {
  FEED: "#0EA5E9",
  ELECTRICITY: "#F59E0B",
  LABOUR: "#22C55E",
  MEDICINE: "#EF4444",
  EQUIPMENT: "#8B5CF6",
  FUEL: "#F97316",
  SEED: "#06B6D4",
  OTHER: "#6B7280",
};

export default function Reports() {
  const { farmId } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashRes, expRes] = await Promise.all([
        dashboardAPI.get(farmId),
        expenseAPI.getAll(farmId),
      ]);
      setDashboard(dashRes.data.data);
      setExpenses(expRes.data.data || []);
    } catch (error) {
      console.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div
          className="w-10 h-10 border-4 border-[#334155] border-t-[#0EA5E9] 
                        rounded-full animate-spin"
        />
      </div>
    );
  }

  // Group expenses by category for pie chart
  const expenseByCategory = expenses.reduce((acc, exp) => {
    const existing = acc.find((a) => a.name === exp.category);
    if (existing) {
      existing.value += exp.amount;
    } else {
      acc.push({ name: exp.category, value: exp.amount });
    }
    return acc;
  }, []);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Pond comparison
  const pondComparison =
    dashboard?.ponds?.map((pond) => ({
      name: pond.pondName,
      size: pond.sizeAcre,
      day: pond.cultureDay,
      weight: pond.latestWeight || 0,
      feed: pond.totalFeedKg || 0,
      cost: pond.totalFeedCost || 0,
    })) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold text-white">Reports & Analytics 📋</h1>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div
          className="bg-gradient-to-br from-orange-500/20 to-orange-600/5 
                        border border-orange-500/30 rounded-xl p-5"
        >
          <p className="text-orange-400 text-sm">Total Investment</p>
          <p className="text-white text-3xl font-bold mt-1 font-mono">
            ₹{totalExpense.toLocaleString()}
          </p>
        </div>
        <div
          className="bg-gradient-to-br from-green-500/20 to-green-600/5 
                        border border-green-500/30 rounded-xl p-5"
        >
          <p className="text-green-400 text-sm">Estimated Revenue</p>
          <p className="text-white text-3xl font-bold mt-1 font-mono">
            ₹{(dashboard?.estimatedRevenue || 0).toLocaleString()}
          </p>
        </div>
        <div
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/5 
                        border border-blue-500/30 rounded-xl p-5"
        >
          <p className="text-blue-400 text-sm">Expected Profit</p>
          <p className="text-white text-3xl font-bold mt-1 font-mono">
            ₹
            {(
              (dashboard?.estimatedRevenue || 0) - totalExpense
            ).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Expense Pie Chart */}
      {expenseByCategory.length > 0 && (
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">
            💰 Expense Breakdown
          </h3>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {expenseByCategory.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={EXPENSE_COLORS[entry.name] || "#6B7280"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                  }}
                  formatter={(value) => `₹${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Pond Comparison Table */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 sm:p-5">
        <h3 className="text-white font-semibold mb-4">🦐 Pond Comparison</h3>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full text-sm" style={{ minWidth: "500px" }}>
            <thead>
              <tr className="text-[#94A3B8] border-b border-[#334155]">
                <th className="text-left py-2">Pond</th>
                <th className="text-right py-2">Size</th>
                <th className="text-right py-2">Day</th>
                <th className="text-right py-2">Weight</th>
                <th className="text-right py-2">Feed (kg)</th>
                <th className="text-right py-2">Feed Cost</th>
              </tr>
            </thead>
            <tbody>
              {pondComparison.map((pond) => (
                <tr
                  key={pond.name}
                  className="border-b border-[#334155]/50 hover:bg-[#334155]/20"
                >
                  <td className="py-3 text-white font-medium">{pond.name}</td>
                  <td className="py-3 text-right text-[#94A3B8]">
                    {pond.size} ac
                  </td>
                  <td className="py-3 text-right text-[#94A3B8] font-mono">
                    {pond.day}
                  </td>
                  <td className="py-3 text-right text-white font-mono">
                    {pond.weight ? `${pond.weight}g` : "—"}
                  </td>
                  <td className="py-3 text-right text-[#0EA5E9] font-mono font-bold">
                    {pond.feed}
                  </td>
                  <td className="py-3 text-right text-[#F59E0B] font-mono">
                    ₹{pond.cost.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feed Statistics */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">🍤 Feed Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCard
            label="Total Feed"
            value={`${dashboard?.totalFeedConsumedKg || 0} kg`}
          />
          <InfoCard
            label="Feed Cost"
            value={`₹${((dashboard?.totalFeedConsumedKg || 0) * 320).toLocaleString()}`}
          />
          <InfoCard
            label="Bags Used"
            value={Math.ceil((dashboard?.totalFeedConsumedKg || 0) / 25)}
          />
          <InfoCard
            label="Daily Average"
            value={`${dashboard?.todayTotalFeedKg || 0} kg`}
          />
        </div>
      </div>
      {/* filler to consume remaining vertical space so layout appears full */}
      <div className="flex-1" />
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-[#0F172A] rounded-xl p-4 text-center">
      <p className="text-[#94A3B8] text-xs uppercase">{label}</p>
      <p className="text-white text-xl font-bold mt-1 font-mono">{value}</p>
    </div>
  );
}
