// src/pages/GrowthEntry.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pondAPI, growthAPI } from '../api/axios';
import toast from 'react-hot-toast';

export default function GrowthEntry() {
  const { farmId } = useAuth();
  const navigate = useNavigate();
  const [ponds, setPonds] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    pondId: null,
    sampleDate: new Date().toISOString().split('T')[0],
    avgWeightGrams: '',
    sampleCount: 50,
    survivalRate: 85,
    healthStatus: 'HEALTHY',
    remarks: '',
  });

  // Live calculations
  const selectedPond = ponds.find((p) => p.id === form.pondId);
  const aliveCount = selectedPond
    ? Math.round(selectedPond.seedCount * (form.survivalRate / 100))
    : 0;
  const biomass = form.avgWeightGrams
    ? ((aliveCount * parseFloat(form.avgWeightGrams)) / 1000).toFixed(1)
    : 0;

  useEffect(() => {
    fetchPonds();
  }, []);

  const fetchPonds = async () => {
    try {
      const response = await pondAPI.getAll(farmId);
      setPonds(response.data.data || []);
    } catch (error) {
      console.error('Failed to load ponds');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pondId) {
      toast.error('Select a pond');
      return;
    }

    setLoading(true);
    try {
      const response = await growthAPI.add({
        ...form,
        avgWeightGrams: parseFloat(form.avgWeightGrams),
        sampleCount: parseInt(form.sampleCount),
        survivalRate: parseFloat(form.survivalRate),
      });

      toast.success('Growth sample saved! 📊');
      navigate(`/ponds/${form.pondId}`);
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full bg-[#0F172A] border border-[#334155] rounded-xl 
                      px-4 py-3 text-white focus:border-[#0EA5E9] transition-colors`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">
        Weekly Growth Sample 📊
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Pond Selection */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
          <label className="block text-[#94A3B8] text-sm mb-3">Select Pond</label>
          <div className="grid grid-cols-2 gap-2">
            {ponds.map((pond) => (
              <button
                key={pond.id}
                type="button"
                onClick={() => setForm({ ...form, pondId: pond.id })}
                className={`p-3 rounded-xl text-left transition-all
                  ${form.pondId === pond.id
                    ? 'bg-[#0EA5E9]/20 border-2 border-[#0EA5E9] text-white'
                    : 'bg-[#0F172A] border border-[#334155] text-[#94A3B8]'
                  }`}
              >
                <div className="font-semibold text-sm">
                  {form.pondId === pond.id && '✅ '}{pond.pondName}
                </div>
                <div className="text-xs mt-0.5 opacity-70">
                  {pond.sizeAcre} ac • Day {pond.cultureDay}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
          <label className="block text-[#94A3B8] text-sm mb-2">Sample Date</label>
          <input
            type="date"
            value={form.sampleDate}
            onChange={(e) => setForm({ ...form, sampleDate: e.target.value })}
            className={inputClass}
          />
        </div>

        {/* Average Weight */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
          <label className="block text-[#94A3B8] text-sm mb-2">
            🦐 Average Body Weight (grams)
          </label>
          <input
            type="number"
            value={form.avgWeightGrams}
            onChange={(e) => setForm({ ...form, avgWeightGrams: e.target.value })}
            placeholder="e.g., 12.5"
            className={`${inputClass} text-2xl font-bold text-center`}
            step="0.1"
            min="0.1"
            required
          />
        </div>

        {/* Survival Rate Slider */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
          <label className="block text-[#94A3B8] text-sm mb-3">
            Survival Rate: <span className="text-white font-bold">{form.survivalRate}%</span>
          </label>
          <input
            type="range"
            min="50"
            max="100"
            value={form.survivalRate}
            onChange={(e) => setForm({ ...form, survivalRate: e.target.value })}
            className="w-full accent-[#0EA5E9]"
          />
          <div className="flex justify-between text-xs text-[#94A3B8] mt-1">
            <span>50%</span>
            <span>100%</span>
          </div>

          {/* Quick buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
            {[95, 90, 85, 80, 75, 70].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setForm({ ...form, survivalRate: rate })}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all
                  ${parseInt(form.survivalRate) === rate
                    ? 'bg-[#0EA5E9] text-white'
                    : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155]'
                  }`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>

        {/* Live Calculations */}
        {form.avgWeightGrams && form.pondId && (
          <div className="bg-gradient-to-r from-[#22C55E]/10 to-[#0EA5E9]/10 
                          border border-[#22C55E]/20 rounded-xl p-5">
            <h3 className="text-[#22C55E] font-semibold mb-3">
              📊 Auto-Calculated Results
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#94A3B8] text-xs">Estimated Alive</p>
                <p className="text-white text-xl font-bold font-mono">
                  {aliveCount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-xs">Estimated Biomass</p>
                <p className="text-white text-xl font-bold font-mono">
                  {biomass} kg
                </p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-xs">Count per KG</p>
                <p className="text-white text-xl font-bold font-mono">
                  {form.avgWeightGrams
                    ? Math.round(1000 / parseFloat(form.avgWeightGrams))
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-xs">Rec. Daily Feed</p>
                <p className="text-[#0EA5E9] text-xl font-bold font-mono">
                  {biomass ? (parseFloat(biomass) * 0.03).toFixed(1) : '—'} kg
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Health Status */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
          <label className="block text-[#94A3B8] text-sm mb-3">Health Status</label>
          <div className="flex gap-2">
            {[
              { val: 'HEALTHY', label: '🟢 Healthy' },
              { val: 'MILD_ISSUE', label: '🟡 Mild Issue' },
              { val: 'DISEASE', label: '🔴 Disease' },
            ].map((status) => (
              <button
                key={status.val}
                type="button"
                onClick={() => setForm({ ...form, healthStatus: status.val })}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all
                  ${form.healthStatus === status.val
                    ? 'bg-[#0EA5E9] text-white'
                    : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155]'
                  }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !form.pondId || !form.avgWeightGrams}
          className="w-full py-4 bg-[#22C55E] hover:bg-[#16A34A] 
                     disabled:opacity-40 text-white rounded-xl 
                     font-bold text-lg transition-all"
        >
          {loading ? 'Saving...' : 'Save Growth Sample ✅'}
        </button>
      </form>
    </div>
  );
}