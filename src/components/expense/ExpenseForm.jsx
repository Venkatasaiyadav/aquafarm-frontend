// src/components/expense/ExpenseForm.jsx

import { useState } from 'react';
import { expenseAPI } from '../../api/axios';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'FEED', label: '🍤 Feed', color: 'border-blue-500 bg-blue-500/20' },
  { value: 'ELECTRICITY', label: '⚡ Electricity', color: 'border-yellow-500 bg-yellow-500/20' },
  { value: 'LABOUR', label: '👷 Labour', color: 'border-green-500 bg-green-500/20' },
  { value: 'MEDICINE', label: '💊 Medicine', color: 'border-red-500 bg-red-500/20' },
  { value: 'EQUIPMENT', label: '🔧 Equipment', color: 'border-purple-500 bg-purple-500/20' },
  { value: 'FUEL', label: '⛽ Fuel', color: 'border-orange-500 bg-orange-500/20' },
  { value: 'SEED', label: '🦐 Seed', color: 'border-cyan-500 bg-cyan-500/20' },
  { value: 'OTHER', label: '📦 Other', color: 'border-gray-500 bg-gray-500/20' },
];

// Quick amounts for common expenses
const QUICK_AMOUNTS = {
  FEED: [8000, 16000, 40000, 80000],
  ELECTRICITY: [5000, 7000, 10000, 15000],
  LABOUR: [10000, 50000, 100000, 160000],
  MEDICINE: [2000, 5000, 10000, 20000],
  EQUIPMENT: [5000, 10000, 25000, 50000],
  FUEL: [1000, 2000, 5000, 10000],
  SEED: [50000, 100000, 200000, 500000],
  OTHER: [1000, 5000, 10000, 50000],
};

export default function ExpenseForm({
  farmId,
  ponds = [],
  onSuccess,
  onCancel,
}) {
  const [form, setForm] = useState({
    expenseDate: new Date().toISOString().split('T')[0],
    category: 'FEED',
    amount: '',
    description: '',
    pondId: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error('Please enter amount');
      return;
    }

    setLoading(true);
    try {
      const response = await expenseAPI.add(farmId, {
        ...form,
        amount: parseFloat(form.amount),
      });

      toast.success('Expense saved! 💰');
      if (onSuccess) onSuccess(response.data.data);

      // Reset form
      setForm({
        expenseDate: new Date().toISOString().split('T')[0],
        category: 'FEED',
        amount: '',
        description: '',
        pondId: null,
      });
    } catch (error) {
      toast.error('Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full bg-[#0F172A] border border-[#334155] rounded-xl 
                      px-4 py-3 text-white focus:border-[#F59E0B] transition-colors`;

  // Get quick amounts for selected category
  const quickAmounts = QUICK_AMOUNTS[form.category] || QUICK_AMOUNTS.OTHER;

  // Feed-specific fields
  const showFeedDetails = form.category === 'FEED';

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold text-lg">💰 Add Expense</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-[#94A3B8] hover:text-white text-xl"
          >
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Date + Amount Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#94A3B8] text-sm mb-1.5">📅 Date</label>
            <input
              type="date"
              value={form.expenseDate}
              onChange={(e) => handleChange('expenseDate', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[#94A3B8] text-sm mb-1.5">💵 Amount (₹)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="Enter amount"
              className={`${inputClass} text-xl font-bold`}
              required
              min="1"
            />
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div>
          <p className="text-[#94A3B8] text-xs mb-2">Quick amounts:</p>
          <div className="flex gap-2 flex-wrap">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleChange('amount', amt.toString())}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${parseFloat(form.amount) === amt
                    ? 'bg-[#F59E0B] text-white'
                    : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155]'
                  }`}
              >
                ₹{amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Category Grid */}
        <div>
          <label className="block text-[#94A3B8] text-sm mb-2">📂 Category</label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => handleChange('category', cat.value)}
                className={`py-2.5 rounded-xl text-xs font-medium transition-all border
                  ${form.category === cat.value
                    ? `${cat.color} text-white`
                    : 'bg-[#0F172A] text-[#94A3B8] border-[#334155]'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feed-specific: Bag calculation */}
        {showFeedDetails && form.amount && (
          <div className="bg-[#0F172A] rounded-xl p-3 border border-[#334155]">
            <p className="text-[#94A3B8] text-xs mb-2">🍤 Feed Calculation</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[#94A3B8] text-[10px]">Bags</p>
                <p className="text-white font-bold font-mono">
                  {Math.ceil(parseFloat(form.amount) / 8000)}
                </p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-[10px]">Total KG</p>
                <p className="text-white font-bold font-mono">
                  {Math.ceil(parseFloat(form.amount) / 8000) * 25}
                </p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-[10px]">₹/KG</p>
                <p className="text-white font-bold font-mono">₹320</p>
              </div>
            </div>
          </div>
        )}

        {/* Pond Assignment */}
        <div>
          <label className="block text-[#94A3B8] text-sm mb-2">
            🦐 Assign to Pond (Optional)
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleChange('pondId', null)}
              className={`px-3 py-2 rounded-lg text-xs transition-all
                ${form.pondId === null
                  ? 'bg-[#F59E0B] text-white'
                  : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155]'
                }`}
            >
              🏠 Farm Level
            </button>
            {ponds.map((pond) => (
              <button
                key={pond.id}
                type="button"
                onClick={() => handleChange('pondId', pond.id)}
                className={`px-3 py-2 rounded-lg text-xs transition-all
                  ${form.pondId === pond.id
                    ? 'bg-[#F59E0B] text-white'
                    : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155]'
                  }`}
              >
                {pond.pondName}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[#94A3B8] text-sm mb-1.5">
            📝 Description
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="e.g., Avanti 10 bags, Monthly salary..."
            className={inputClass}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-[#334155] hover:bg-[#475569] 
                         text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !form.amount}
            className={`${onCancel ? 'flex-1' : 'w-full'} py-3 bg-[#F59E0B] 
                       hover:bg-[#D97706] disabled:opacity-50 text-white 
                       rounded-xl font-semibold transition-colors`}
          >
            {loading ? 'Saving...' : 'Save Expense ✅'}
          </button>
        </div>
      </form>
    </div>
  );
}