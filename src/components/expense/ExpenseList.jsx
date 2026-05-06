// src/components/expense/ExpenseList.jsx

import { formatDate } from "../../utils/date";

const CATEGORY_CONFIG = {
  FEED: { icon: "🍤", label: "Feed", color: "bg-blue-500" },
  ELECTRICITY: { icon: "⚡", label: "Electricity", color: "bg-yellow-500" },
  LABOUR: { icon: "👷", label: "Labour", color: "bg-green-500" },
  MEDICINE: { icon: "💊", label: "Medicine", color: "bg-red-500" },
  EQUIPMENT: { icon: "🔧", label: "Equipment", color: "bg-purple-500" },
  FUEL: { icon: "⛽", label: "Fuel", color: "bg-orange-500" },
  SEED: { icon: "🦐", label: "Seed", color: "bg-cyan-500" },
  OTHER: { icon: "📦", label: "Other", color: "bg-gray-500" },
};

export default function ExpenseList({
  expenses = [],
  limit = null,
  showFilters = true,
}) {
  const displayExpenses = limit ? expenses.slice(0, limit) : expenses;
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category for summary
  const categoryTotals = expenses.reduce((acc, exp) => {
    const key = exp.category;
    if (!acc[key]) acc[key] = 0;
    acc[key] += exp.amount;
    return acc;
  }, {});

  if (expenses.length === 0) {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 text-center">
        <span className="text-5xl block mb-3">💰</span>
        <h3 className="text-white font-semibold mb-1">No Expenses Yet</h3>
        <p className="text-[#94A3B8] text-sm">
          Start recording expenses to track your farm costs
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Summary */}
      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([category, total]) => {
              const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.OTHER;
              const percentage = ((total / totalAmount) * 100).toFixed(0);
              return (
                <div
                  key={category}
                  className="bg-[#1E293B] border border-[#334155] rounded-xl p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${config.color}`} />
                    <span className="text-[#94A3B8] text-xs">
                      {config.label}
                    </span>
                  </div>
                  <p className="text-white font-bold font-mono text-sm">
                    ₹{total.toLocaleString()}
                  </p>
                  <p className="text-[#64748B] text-[10px]">
                    {percentage}% of total
                  </p>
                </div>
              );
            })}
        </div>
      )}

      {/* Total Banner */}
      <div
        className="flex items-center justify-between bg-[#1E293B] 
                      border border-[#334155] rounded-xl px-4 py-3"
      >
        <div>
          <p className="text-[#94A3B8] text-xs">Total Expenses</p>
          <p className="text-white font-bold font-mono text-xl">
            ₹{totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[#94A3B8] text-xs">Entries</p>
          <p className="text-white font-bold font-mono">{expenses.length}</p>
        </div>
      </div>

      {/* Expense Items */}
      <div
        className="bg-[#1E293B] border border-[#334155] rounded-xl 
                      divide-y divide-[#334155] overflow-hidden"
      >
        {displayExpenses.map((expense) => {
          const config =
            CATEGORY_CONFIG[expense.category] || CATEGORY_CONFIG.OTHER;
          return (
            <div
              key={expense.id}
              className="flex items-center justify-between px-4 py-3.5
                         hover:bg-[#334155]/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Category Color Bar */}
                <div className={`w-1.5 h-10 ${config.color} rounded-full`} />

                {/* Category Icon */}
                <div
                  className="w-10 h-10 rounded-lg bg-[#0F172A] 
                                flex items-center justify-center text-lg"
                >
                  {config.icon}
                </div>

                {/* Details */}
                <div>
                  <p className="text-white text-sm font-medium">
                    {config.label}
                    {expense.pondName && expense.pondName !== "Farm Level" && (
                      <span className="text-[#0EA5E9] text-xs ml-2">
                        {expense.pondName}
                      </span>
                    )}
                  </p>
                  <p className="text-[#94A3B8] text-xs">
                    {formatDate(expense.expenseDate)}
                    {expense.description && (
                      <span className="ml-1">• {expense.description}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <span className="text-white font-bold font-mono text-base">
                  ₹{expense.amount.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More Indicator */}
      {limit && expenses.length > limit && (
        <p className="text-center text-[#94A3B8] text-sm">
          Showing {limit} of {expenses.length} expenses
        </p>
      )}
    </div>
  );
}
