// src/pages/FeedEntry.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pondAPI, feedAPI } from '../api/axios';
import toast from 'react-hot-toast';

export default function FeedEntry() {
  const { farmId } = useAuth();
  const navigate = useNavigate();

  const [ponds, setPonds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    pondId: null,
    feedDate: new Date().toISOString().split('T')[0],
    feedTime: 'MORNING',
    feedStage: 'STARTER',
    quantityKg: '',
    brand: 'AVANTI',
  });

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
      toast.error('Please select a pond');
      return;
    }
    if (!form.quantityKg || form.quantityKg <= 0) {
      toast.error('Please enter feed quantity');
      return;
    }

    setLoading(true);
    try {
      await feedAPI.add({
        ...form,
        quantityKg: parseFloat(form.quantityKg),
      });

      setSubmitted(true);
      toast.success('Feed entry saved successfully! 🎉');

      setTimeout(() => {
        setSubmitted(false);
        setForm((prev) => ({
          ...prev,
          pondId: null,
          quantityKg: '',
        }));
      }, 2000);
    } catch (error) {
      toast.error('Failed to save feed entry');
    } finally {
      setLoading(false);
    }
  };

  const quickQuantities = [10, 15, 20, 25, 30, 35, 40, 50];
  const feedTimes = [
    { value: 'MORNING', label: 'Morning', icon: '🌅', bg: 'linear-gradient(135deg, #F59E0B, #F97316)' },
    { value: 'AFTERNOON', label: 'Afternoon', icon: '☀️', bg: 'linear-gradient(135deg, #FBBF24, #F59E0B)' },
    { value: 'EVENING', label: 'Evening', icon: '🌙', bg: 'linear-gradient(135deg, #818CF8, #7C3AED)' },
  ];
  const feedStages = [
    { value: 'STARTER', bg: '#22C55E', label: 'Starter' },
    { value: 'GROWER', bg: '#3B82F6', label: 'Grower' },
    { value: 'FINISHER', bg: '#8B5CF6', label: 'Finisher' },
  ];

  if (submitted) {
    return (
      <div style={{
        minHeight: '70vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '1.5rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1E293B, #0F172A)',
          border: '1px solid #334155', borderRadius: '1.5rem',
          padding: '2rem', maxWidth: '420px', width: '100%',
          textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
        }}>
          <div style={{
            width: '80px', height: '80px', background: 'linear-gradient(135deg, #34D399, #059669)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem', fontSize: '2rem', color: 'white',
            boxShadow: '0 8px 25px rgba(34,197,94,0.3)'
          }}>✓</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.5rem' }}>
            Feed Saved!
          </h2>
          <p style={{ color: '#94A3B8', marginBottom: '1.5rem' }}>
            {form.quantityKg} kg added to {ponds.find((p) => p.id === form.pondId)?.pondName}
          </p>
          <div style={{
            background: '#0F172A', borderRadius: '1rem', padding: '1rem',
            marginBottom: '1.5rem', border: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94A3B8' }}>Time:</span>
              <span style={{ color: 'white', fontWeight: 500 }}>{form.feedTime}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: '#94A3B8' }}>Stage:</span>
              <span style={{ color: 'white', fontWeight: 500 }}>{form.feedStage}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setSubmitted(false)}
              style={{
                flex: 1, padding: '0.875rem', background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
                color: 'white', borderRadius: '0.75rem', fontWeight: 600, border: 'none',
                cursor: 'pointer', fontSize: '0.95rem'
              }}
            >
              Add Another
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                flex: 1, padding: '0.875rem', background: '#334155',
                color: 'white', borderRadius: '0.75rem', fontWeight: 600, border: 'none',
                cursor: 'pointer', fontSize: '0.95rem'
              }}
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', paddingBottom: '6rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1.75rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
            Add Feed Entry
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Record daily feeding activity</p>
        </div>
        <div style={{
          width: '48px', height: '48px', background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
          borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', boxShadow: '0 8px 20px rgba(245,158,11,0.2)'
        }}>🍤</div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Date Section */}
        <section className="feed-section">
          <label className="feed-section-label">
            <span>📅</span> Date
          </label>
          <input
            type="date"
            value={form.feedDate}
            onChange={(e) => setForm({ ...form, feedDate: e.target.value })}
            className="form-input"
          />
        </section>

        {/* Feed Time */}
        <section className="feed-section">
          <label className="feed-section-label">
            <span>⏰</span> Feed Time
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {feedTimes.map((time) => (
              <button
                key={time.value}
                type="button"
                onClick={() => setForm({ ...form, feedTime: time.value })}
                className="feed-time-btn"
                style={{
                  background: form.feedTime === time.value ? time.bg : 'rgba(15, 23, 42, 0.8)',
                  border: form.feedTime === time.value ? 'none' : '1px solid #334155',
                  color: form.feedTime === time.value ? 'white' : '#94A3B8',
                  transform: form.feedTime === time.value ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: form.feedTime === time.value ? '0 8px 25px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.35rem' }}>{time.icon}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{time.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Pond Selection */}
        <section className="feed-section">
          <label className="feed-section-label">
            <span>🦐</span> Select Pond
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {ponds.map((pond) => (
              <button
                key={pond.id}
                type="button"
                onClick={() => setForm({ ...form, pondId: pond.id })}
                className="feed-pond-btn"
                style={{
                  background: form.pondId === pond.id
                    ? 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(37,99,235,0.2))'
                    : 'rgba(15, 23, 42, 0.8)',
                  border: form.pondId === pond.id
                    ? '2px solid #0EA5E9'
                    : '1px solid #334155',
                  boxShadow: form.pondId === pond.id
                    ? '0 4px 20px rgba(14,165,233,0.15)'
                    : 'none',
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '0.35rem'
                }}>
                  <span style={{
                    fontWeight: 600, color: form.pondId === pond.id ? 'white' : '#E2E8F0',
                    fontSize: '0.95rem'
                  }}>
                    {form.pondId === pond.id && <span style={{ marginRight: '0.35rem' }}>✓</span>}
                    {pond.pondName}
                  </span>
                  {form.pondId === pond.id && (
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: '#38BDF8', animation: 'pulse 2s infinite'
                    }} />
                  )}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: form.pondId === pond.id ? '#BAE6FD' : '#64748B'
                }}>
                  {pond.sizeAcre} acres • Day {pond.cultureDay}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Feed Stage */}
        <section className="feed-section">
          <label className="feed-section-label">
            <span>📦</span> Feed Stage
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {feedStages.map((stage) => (
              <button
                key={stage.value}
                type="button"
                onClick={() => setForm({ ...form, feedStage: stage.value })}
                className="feed-stage-btn"
                style={{
                  flex: 1,
                  background: form.feedStage === stage.value ? stage.bg : 'rgba(15, 23, 42, 0.8)',
                  border: form.feedStage === stage.value ? 'none' : '1px solid #334155',
                  color: form.feedStage === stage.value ? 'white' : '#94A3B8',
                  transform: form.feedStage === stage.value ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: form.feedStage === stage.value ? '0 6px 20px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                {stage.label}
              </button>
            ))}
          </div>
        </section>

        {/* Feed Quantity - Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #1E293B, #0F172A)',
          border: '1px solid #334155', borderRadius: '1.5rem',
          padding: '1.5rem'
        }}>
          <label className="feed-section-label" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <span>⚖️</span> Feed Quantity
          </label>

          {/* Main Quantity Display */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '1rem', marginBottom: '2rem'
          }}>
            <button
              type="button"
              onClick={() => setForm({
                ...form,
                quantityKg: Math.max(0, (parseFloat(form.quantityKg) || 0) - 1).toString()
              })}
              className="qty-btn qty-btn-minus"
            >−</button>

            <div style={{ textAlign: 'center', flex: '1', maxWidth: '200px' }}>
              <input
                type="number"
                value={form.quantityKg}
                onChange={(e) => setForm({ ...form, quantityKg: e.target.value })}
                placeholder="0"
                className="qty-input"
                min="0"
                step="0.5"
              />
              <span style={{ display: 'block', color: '#94A3B8', fontSize: '1.1rem', fontWeight: 500, marginTop: '0.25rem' }}>
                kilograms
              </span>
            </div>

            <button
              type="button"
              onClick={() => setForm({
                ...form,
                quantityKg: ((parseFloat(form.quantityKg) || 0) + 1).toString()
              })}
              className="qty-btn qty-btn-plus"
            >+</button>
          </div>

          {/* Quick Select */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center'
          }}>
            {quickQuantities.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setForm({ ...form, quantityKg: amount.toString() })}
                className="quick-qty-btn"
                style={{
                  background: parseFloat(form.quantityKg) === amount
                    ? 'linear-gradient(135deg, #0EA5E9, #2563EB)'
                    : 'rgba(15, 23, 42, 0.8)',
                  border: parseFloat(form.quantityKg) === amount
                    ? 'none'
                    : '1px solid #334155',
                  color: parseFloat(form.quantityKg) === amount ? 'white' : '#94A3B8',
                  boxShadow: parseFloat(form.quantityKg) === amount
                    ? '0 4px 15px rgba(14,165,233,0.3)'
                    : 'none',
                  transform: parseFloat(form.quantityKg) === amount ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                {amount} kg
              </button>
            ))}
          </div>
        </section>

        {/* Submit Button */}
        <div className="feed-submit-bar">
          <button
            type="submit"
            disabled={loading || !form.pondId || !form.quantityKg}
            className="feed-submit-btn"
          >
            {loading ? (
              <>
                <span className="spinner" />
                Saving Entry...
              </>
            ) : (
              <>
                <span>Save Feed Entry</span>
                <span style={{ fontSize: '1.2rem' }}>✓</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}