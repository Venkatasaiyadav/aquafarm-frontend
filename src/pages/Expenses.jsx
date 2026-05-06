// src/pages/Expenses.jsx

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { expenseAPI, pondAPI } from "../api/axios";
import { formatDate } from "../utils/date";
import toast from "react-hot-toast";

const CATEGORIES = [
  { value: "FEED", label: "🍤 Feed" },
  { value: "ELECTRICITY", label: "⚡ Electric" },
  { value: "LABOUR", label: "👷 Labour" },
  { value: "MEDICINE", label: "💊 Medicine" },
  { value: "EQUIPMENT", label: "🔧 Equip" },
  { value: "FUEL", label: "⛽ Fuel" },
  { value: "SEED", label: "🦐 Seed" },
  { value: "OTHER", label: "📦 Other" },
];

const CAT_COLORS = {
  FEED: "#3B82F6",
  ELECTRICITY: "#EAB308",
  LABOUR: "#22C55E",
  MEDICINE: "#EF4444",
  EQUIPMENT: "#8B5CF6",
  FUEL: "#F97316",
  SEED: "#06B6D4",
  OTHER: "#6B7280",
};

export default function Expenses() {
  const { farmId } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [ponds, setPonds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    expenseDate: new Date().toISOString().split("T")[0],
    category: "FEED",
    amount: "",
    description: "",
    pondId: null,
  });

  useEffect(() => {
    fetchExpenses();
    fetchPonds();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await expenseAPI.getAll(farmId);
      setExpenses(response.data.data || []);
    } catch (error) {
      console.error("Failed to load expenses");
    }
  };

  const fetchPonds = async () => {
    try {
      const response = await pondAPI.getAll(farmId);
      setPonds(response.data.data || []);
    } catch (error) {
      console.error("Failed to load ponds");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await expenseAPI.add(farmId, {
        ...form,
        amount: parseFloat(form.amount),
      });
      toast.success("Expense recorded! 💰");
      setShowForm(false);
      setForm({
        expenseDate: new Date().toISOString().split("T")[0],
        category: "FEED",
        amount: "",
        description: "",
        pondId: null,
      });
      fetchExpenses();
    } catch (error) {
      toast.error("Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", paddingBottom: "5rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "white",
              marginBottom: "0.2rem",
            }}
          >
            Expenses 💰
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.85rem" }}>
            Total:{" "}
            <span
              style={{
                color: "#FBBF24",
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              ₹{totalExpense.toLocaleString()}
            </span>
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="expense-toggle-btn"
          style={{
            background: showForm
              ? "rgba(239, 68, 68, 0.15)"
              : "linear-gradient(135deg, #F59E0B, #D97706)",
            color: showForm ? "#F87171" : "white",
            border: showForm ? "1px solid rgba(239,68,68,0.3)" : "none",
          }}
        >
          {showForm ? "✕ Close" : "+ Add Expense"}
        </button>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <div className="expense-form-card">
          <h3
            style={{
              color: "white",
              fontWeight: 600,
              fontSize: "1.05rem",
              marginBottom: "1.25rem",
            }}
          >
            Add New Expense
          </h3>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Date & Amount Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
              }}
            >
              <div>
                <label className="expense-label">Date</label>
                <input
                  type="date"
                  value={form.expenseDate}
                  onChange={(e) =>
                    setForm({ ...form, expenseDate: e.target.value })
                  }
                  className="expense-input"
                />
              </div>
              <div>
                <label className="expense-label">Amount (₹)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="expense-input"
                  required
                  min="1"
                />
              </div>
            </div>

            {/* Category Grid */}
            <div>
              <label className="expense-label">Category</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "0.5rem",
                }}
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat.value })}
                    className="expense-cat-btn"
                    style={{
                      background:
                        form.category === cat.value
                          ? CAT_COLORS[cat.value]
                          : "rgba(15, 23, 42, 0.8)",
                      border:
                        form.category === cat.value
                          ? "none"
                          : "1px solid #334155",
                      color: form.category === cat.value ? "white" : "#94A3B8",
                      transform:
                        form.category === cat.value
                          ? "scale(1.05)"
                          : "scale(1)",
                      boxShadow:
                        form.category === cat.value
                          ? `0 4px 15px ${CAT_COLORS[cat.value]}40`
                          : "none",
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="expense-label">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="e.g., Avanti 10 bags"
                className="expense-input"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !form.amount}
              className="expense-submit-btn"
            >
              {loading ? "Saving..." : "Save Expense ✅"}
            </button>
          </form>
        </div>
      )}

      {/* Expense List */}
      <div className="expense-list-card">
        {expenses.length === 0 ? (
          <div
            style={{
              padding: "3rem 1rem",
              textAlign: "center",
              color: "#94A3B8",
            }}
          >
            <span
              style={{
                fontSize: "3rem",
                display: "block",
                marginBottom: "0.75rem",
              }}
            >
              💰
            </span>
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                color: "#CBD5E1",
                marginBottom: "0.25rem",
              }}
            >
              No expenses recorded yet
            </p>
            <p style={{ fontSize: "0.8rem" }}>
              Tap "+ Add Expense" to start tracking
            </p>
          </div>
        ) : (
          <div>
            {expenses.map((expense, idx) => {
              const color = CAT_COLORS[expense.category] || CAT_COLORS.OTHER;
              const cat = CATEGORIES.find((c) => c.value === expense.category);
              return (
                <div
                  key={expense.id}
                  className="expense-row"
                  style={{
                    borderBottom:
                      idx < expenses.length - 1
                        ? "1px solid rgba(51,65,85,0.4)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: "4px",
                        height: "36px",
                        borderRadius: "999px",
                        background: color,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          color: "white",
                          fontSize: "0.9rem",
                          fontWeight: 500,
                        }}
                      >
                        {cat?.label || expense.category}
                      </p>
                      <p style={{ color: "#64748B", fontSize: "0.75rem" }}>
                        {formatDate(expense.expenseDate)}
                        {expense.description && ` • ${expense.description}`}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontFamily: "monospace",
                      fontSize: "0.95rem",
                      flexShrink: 0,
                    }}
                  >
                    ₹{expense.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}

            {/* Total Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.875rem 1.25rem",
                background: "rgba(245, 158, 11, 0.08)",
                borderTop: "1px solid rgba(245, 158, 11, 0.2)",
              }}
            >
              <span
                style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}
              >
                Total Expenses
              </span>
              <span
                style={{
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "#FBBF24",
                  fontWeight: 700,
                  fontFamily: "monospace",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                }}
              >
                ₹{totalExpense.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
