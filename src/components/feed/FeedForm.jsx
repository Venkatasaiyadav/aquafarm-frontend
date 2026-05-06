// src/components/feed/FeedForm.jsx

/*
 📚 LEARN: Extracting Form into Component
 
 The FeedEntry PAGE had the form built inside it.
 Now we extract it into a SEPARATE component.
 
 WHY?
 - FeedForm can be used in FeedEntry page (full screen)
 - FeedForm can be used in PondDetail page (modal/inline)
 - FeedForm can be used in Dashboard (quick entry)
 
 The PAGE handles navigation and context.
 The FORM handles user input and submission.
 
 Props:
 - ponds: list of ponds to choose from
 - defaultPondId: pre-select a pond (when opened from PondDetail)
 - onSuccess: callback after successful save
 - onCancel: callback to close form
*/

import { useState } from 'react';
import { feedAPI } from '../../api/axios';
import toast from 'react-hot-toast';

const QUICK_AMOUNTS = [10, 15, 20, 25, 30, 35, 40, 50];
const QUICK_REMARKS = [
  'Normal',
  'Reduced Appetite',
  'Weather Issue',
  'After Medicine',
  'High Activity',
  'Low Activity',
];

export default function FeedForm({
  ponds = [],
  defaultPondId = null,
  onSuccess,
  onCancel,
  showPondSelector = true,
}) {
  const [form, setForm] = useState({
    pondId: defaultPondId,
    feedDate: new Date().toISOString().split('T')[0],
    feedTime: 'MORNING',
    feedStage: 'STARTER',
    quantityKg: '',
    brand: 'AVANTI',
    remarks: '',
  });
  const [loading, setLoading] = useState(false);

  // Get selected pond details for AI recommendation
  const selectedPond = ponds.find((p) => p.id === form.pondId);
  const aiRecommendation = selectedPond?.biomass
    ? (selectedPond.biomass * 0.03).toFixed(1)
    : null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const adjustQuantity = (delta) => {
    const current = parseFloat(form.quantityKg) || 0;
    const newVal = Math.max(0, current + delta);
    handleChange('quantityKg', newVal.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.pondId) {
      toast.error('Please select a pond');
      return;
    }
    if (!form.quantityKg || parseFloat(form.quantityKg) <= 0) {
      toast.error('Please enter feed quantity');
      return;
    }

    setLoading(true);
    try {
      const response = await feedAPI.add({
        ...form,
        quantityKg: parseFloat(form.quantityKg),
      });

      const pondName = selectedPond?.pondName || `Pond ${form.pondId}`;
      toast.success(`${form.quantityKg} kg → ${pondName} → ${form.feedTime} ✅`);

      if (onSuccess) {
        onSuccess(response.data.data);
      }

      // Reset quantity and remarks for next entry
      setForm((prev) => ({
        ...prev,
        quantityKg: '',
        remarks: '',
      }));
    } catch (error) {
      toast.error('Failed to save feed entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Date */}
      <FormSection title="📅 Date">
        <input
          type="date"
          value={form.feedDate}
          onChange={(e) => handleChange('feedDate', e.target.value)}
          className="w-full bg-[#0F172A] border border-[#334155] rounded-xl 
                     px-4 py-3 text-white focus:border-[#0EA5E9] transition-colors"
        />
      </FormSection>

      {/* Feed Time */}
      <FormSection title="⏰ Feed Time">
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'MORNING', icon: '🌅', label: 'Morning' },
            { value: 'AFTERNOON', icon: '☀️', label: 'Afternoon' },
            { value: 'EVENING', icon: '🌙', label: 'Evening' },
          ].map((time) => (
            <button
              key={time.value}
              type="button"
              onClick={() => handleChange('feedTime', time.value)}
              className={`py-3 rounded-xl text-sm font-medium transition-all
                ${form.feedTime === time.value
                  ? 'bg-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/20'
                  : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155] hover:border-[#0EA5E9]/50'
                }`}
            >
              {time.icon} {time.label}
            </button>
          ))}
        </div>
      </FormSection>

      {/* Pond Selection */}
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
                    ? 'bg-[#0EA5E9]/20 border-2 border-[#0EA5E9] text-white'
                    : 'bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:border-[#0EA5E9]/50'
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

      {/* Feed Stage */}
      <FormSection title="📦 Feed Stage">
        <div className="flex gap-2">
          {['STARTER', 'GROWER', 'FINISHER'].map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => handleChange('feedStage', stage)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all
                ${form.feedStage === stage
                  ? 'bg-[#22C55E] text-white'
                  : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155]'
                }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </FormSection>

      {/* AI Recommendation */}
      {aiRecommendation && (
        <div className="bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 rounded-xl p-3">
          <p className="text-[#0EA5E9] text-sm">
            🤖 AI Recommends: <strong>{aiRecommendation} kg</strong> for{' '}
            {selectedPond?.pondName} today
          </p>
          <p className="text-[#94A3B8] text-xs mt-1">
            Based on Day {selectedPond?.cultureDay}, Biomass{' '}
            {Math.round(selectedPond?.biomass || 0)} kg
          </p>
        </div>
      )}

      {/* Quantity Input */}
      <FormSection title="⚖️ Feed Quantity">
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            type="button"
            onClick={() => adjustQuantity(-1)}
            className="w-14 h-14 rounded-full bg-[#334155] text-white 
                       text-2xl font-bold hover:bg-[#475569] transition-colors
                       active:scale-95"
          >
            −
          </button>

          <div className="text-center">
            <input
              type="number"
              value={form.quantityKg}
              onChange={(e) => handleChange('quantityKg', e.target.value)}
              placeholder="0"
              className="w-32 bg-transparent text-white text-5xl font-bold 
                         text-center focus:outline-none"
              min="0"
              step="0.5"
            />
            <span className="block text-[#94A3B8] text-lg mt-1">kg</span>
          </div>

          <button
            type="button"
            onClick={() => adjustQuantity(1)}
            className="w-14 h-14 rounded-full bg-[#0EA5E9] text-white 
                       text-2xl font-bold hover:bg-[#0284C7] transition-colors
                       active:scale-95"
          >
            +
          </button>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex gap-2 justify-center flex-wrap">
          {QUICK_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handleChange('quantityKg', amount.toString())}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all
                ${parseFloat(form.quantityKg) === amount
                  ? 'bg-[#0EA5E9] text-white'
                  : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155] hover:border-[#0EA5E9]/50'
                }`}
            >
              {amount}kg
            </button>
          ))}
        </div>
      </FormSection>

      {/* Quick Remarks */}
      <FormSection title="📝 Remarks (Optional)">
        <div className="flex gap-2 flex-wrap mb-3">
          {QUICK_REMARKS.map((remark) => (
            <button
              key={remark}
              type="button"
              onClick={() => handleChange('remarks', remark)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all
                ${form.remarks === remark
                  ? 'bg-[#0EA5E9] text-white'
                  : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155]'
                }`}
            >
              {remark}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={form.remarks}
          onChange={(e) => handleChange('remarks', e.target.value)}
          placeholder="Or type custom remark..."
          className="w-full bg-[#0F172A] border border-[#334155] rounded-xl 
                     px-4 py-3 text-white text-sm focus:border-[#0EA5E9]
                     transition-colors"
        />
      </FormSection>

      {/* Action Buttons */}
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
          disabled={loading || !form.pondId || !form.quantityKg}
          className={`${onCancel ? 'flex-1' : 'w-full'} py-3.5 bg-[#22C55E] 
                     hover:bg-[#16A34A] disabled:opacity-40 
                     disabled:cursor-not-allowed text-white rounded-xl 
                     font-bold text-base transition-all active:scale-[0.98]
                     flex items-center justify-center gap-2`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 
                              border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            'Save Feed Entry ✅'
          )}
        </button>
      </div>
    </form>
  );
}

// Reusable section wrapper
function FormSection({ title, children }) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
      <label className="block text-[#94A3B8] text-sm mb-3">{title}</label>
      {children}
    </div>
  );
}