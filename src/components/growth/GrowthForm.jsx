// src/components/growth/GrowthForm.jsx

import { useState } from 'react';
import { growthAPI } from '../../api/axios';
import toast from 'react-hot-toast';

const SURVIVAL_PRESETS = [95, 90, 85, 80, 75, 70];

export default function GrowthForm({
  ponds = [],
  defaultPondId = null,
  onSuccess,
  onCancel,
  showPondSelector = true,
}) {
  const [form, setForm] = useState({
    pondId: defaultPondId,
    sampleDate: new Date().toISOString().split('T')[0],
    avgWeightGrams: '',
    sampleCount: 50,
    survivalRate: 85,
    healthStatus: 'HEALTHY',
    remarks: '',
  });
  const [loading, setLoading] = useState(false);

  const selectedPond = ponds.find((p) => p.id === form.pondId);

  // Live calculations
  const aliveCount = selectedPond
    ? Math.round(selectedPond.seedCount * (form.survivalRate / 100))
    : 0;
  const biomass = form.avgWeightGrams
    ? ((aliveCount * parseFloat(form.avgWeightGrams)) / 1000).toFixed(1)
    : 0;
  const countPerKg = form.avgWeightGrams
    ? Math.round(1000 / parseFloat(form.avgWeightGrams))
    : 0;

  // Feed recommendation based on culture day
  const getFeedingPercent = () => {
    if (!selectedPond) return 0.03;
    const day = selectedPond.cultureDay;
    if (day <= 30) return 0.08;
    if (day <= 60) return 0.05;
    if (day <= 90) return 0.03;
    return 0.02;
  };

  const recommendedFeed = biomass
    ? (parseFloat(biomass) * getFeedingPercent()).toFixed(1)
    : 0;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.pondId) {
      toast.error('Please select a pond');
      return;
    }
    if (!form.avgWeightGrams || parseFloat(form.avgWeightGrams) <= 0) {
      toast.error('Please enter average weight');
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
      if (onSuccess) onSuccess(response.data.data);
    } catch (error) {
      toast.error('Failed to save growth sample');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Pond Selector */}
      {showPondSelector && (
        <FormSection title="🦐 Select Pond">
          <div className="grid grid-cols-2 gap-2">
            {ponds.map((pond) => (
              <button
                key={pond.id}
                type="button"
                onClick={() => handleChange('pondId', pond.id)}
                className={`p-3 rounded-xl text-left transition-all
                  ${form.pondId === pond.id
                    ? 'bg-[#22C55E]/20 border-2 border-[#22C55E] text-white'
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
        </FormSection>
      )}

      {/* Sample Date */}
      <FormSection title="📅 Sample Date">
        <input
          type="date"
          value={form.sampleDate}
          onChange={(e) => handleChange('sampleDate', e.target.value)}
          className="w-full bg-[#0F172A] border border-[#334155] rounded-xl 
                     px-4 py-3 text-white focus:border-[#22C55E] transition-colors"
        />
      </FormSection>

      {/* Average Weight */}
      <FormSection title="⚖️ Average Body Weight (grams)">
        <div className="relative">
          <input
            type="number"
            value={form.avgWeightGrams}
            onChange={(e) => handleChange('avgWeightGrams', e.target.value)}
            placeholder="12.5"
            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl 
                       px-4 py-4 text-white text-3xl font-bold text-center 
                       focus:border-[#22C55E] transition-colors"
            step="0.1"
            min="0.1"
            required
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 
                          text-[#94A3B8] text-lg">
            grams
          </span>
        </div>

        {/* Prawn size visual */}
        {form.avgWeightGrams && (
          <div className="flex items-center justify-center mt-3 gap-2">
            <span
              className="transition-all duration-500"
              style={{
                fontSize: `${Math.min(16 + parseFloat(form.avgWeightGrams) * 2, 60)}px`,
              }}
            >
              🦐
            </span>
            <span className="text-[#94A3B8] text-sm">
              {parseFloat(form.avgWeightGrams) < 5 && 'Tiny'}
              {parseFloat(form.avgWeightGrams) >= 5 && parseFloat(form.avgWeightGrams) < 15 && 'Growing'}
              {parseFloat(form.avgWeightGrams) >= 15 && parseFloat(form.avgWeightGrams) < 25 && 'Good Size'}
              {parseFloat(form.avgWeightGrams) >= 25 && 'Harvest Ready! 🎉'}
            </span>
          </div>
        )}
      </FormSection>

      {/* Sample Count */}
      <FormSection title="🔢 Prawns Sampled">
        <input
          type="number"
          value={form.sampleCount}
          onChange={(e) => handleChange('sampleCount', e.target.value)}
          className="w-full bg-[#0F172A] border border-[#334155] rounded-xl 
                     px-4 py-3 text-white focus:border-[#22C55E] transition-colors"
          min="1"
        />
      </FormSection>

      {/* Survival Rate */}
      <FormSection title={`📊 Survival Rate: ${form.survivalRate}%`}>
        <input
          type="range"
          min="50"
          max="100"
          value={form.survivalRate}
          onChange={(e) => handleChange('survivalRate', parseFloat(e.target.value))}
          className="w-full accent-[#22C55E] h-2"
        />
        <div className="flex justify-between text-xs text-[#94A3B8] mt-1">
          <span>50% (Poor)</span>
          <span>75% (Average)</span>
          <span>100% (Excellent)</span>
        </div>
        <div className="flex gap-2 mt-3">
          {SURVIVAL_PRESETS.map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => handleChange('survivalRate', rate)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all
                ${form.survivalRate === rate
                  ? 'bg-[#22C55E] text-white'
                  : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155]'
                }`}
            >
              {rate}%
            </button>
          ))}
        </div>
      </FormSection>

      {/* Auto Calculations */}
      {form.avgWeightGrams && form.pondId && (
        <div className="bg-gradient-to-r from-[#22C55E]/10 to-[#0EA5E9]/10 
                        border border-[#22C55E]/20 rounded-xl p-5">
          <h3 className="text-[#22C55E] font-semibold mb-3 text-sm">
            📊 Auto-Calculated Results
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <CalcItem label="Estimated Alive" value={aliveCount.toLocaleString()} />
            <CalcItem label="Biomass" value={`${biomass} kg`} />
            <CalcItem label="Count/KG" value={countPerKg} />
            <CalcItem
              label="Rec. Daily Feed"
              value={`${recommendedFeed} kg`}
              highlight
            />
          </div>
        </div>
      )}

      {/* Health Status */}
      <FormSection title="🏥 Health Status">
        <div className="grid grid-cols-3 gap-2">
          {[
            { val: 'HEALTHY', label: '🟢 Healthy', color: 'border-green-500 bg-green-500/20' },
            { val: 'MILD_ISSUE', label: '🟡 Mild Issue', color: 'border-yellow-500 bg-yellow-500/20' },
            { val: 'DISEASE', label: '🔴 Disease', color: 'border-red-500 bg-red-500/20' },
          ].map((status) => (
            <button
              key={status.val}
              type="button"
              onClick={() => handleChange('healthStatus', status.val)}
              className={`py-3 rounded-xl text-xs font-medium transition-all border
                ${form.healthStatus === status.val
                  ? `${status.color} text-white`
                  : 'bg-[#0F172A] text-[#94A3B8] border-[#334155]'
                }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </FormSection>

      {/* Remarks */}
      <FormSection title="📝 Remarks (Optional)">
        <textarea
          value={form.remarks}
          onChange={(e) => handleChange('remarks', e.target.value)}
          placeholder="Any observations..."
          className="w-full bg-[#0F172A] border border-[#334155] rounded-xl 
                     px-4 py-3 text-white text-sm focus:border-[#22C55E]
                     transition-colors resize-none h-20"
        />
      </FormSection>

      {/* Buttons */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 bg-[#334155] hover:bg-[#475569] 
                       text-white rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !form.pondId || !form.avgWeightGrams}
          className={`${onCancel ? 'flex-1' : 'w-full'} py-3.5 bg-[#22C55E] 
                     hover:bg-[#16A34A] disabled:opacity-40
                     text-white rounded-xl font-bold text-base transition-all`}
        >
          {loading ? 'Saving...' : 'Save Growth Sample ✅'}
        </button>
      </div>
    </form>
  );
}

// Internal helpers
function FormSection({ title, children }) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
      <label className="block text-[#94A3B8] text-sm mb-3">{title}</label>
      {children}
    </div>
  );
}

function CalcItem({ label, value, highlight = false }) {
  return (
    <div>
      <p className="text-[#94A3B8] text-xs">{label}</p>
      <p className={`text-xl font-bold font-mono mt-0.5
                    ${highlight ? 'text-[#0EA5E9]' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}