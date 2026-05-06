// src/pages/Ponds.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pondAPI } from '../api/axios';
import PondForm from '../components/pond/PondForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Ponds() {
  const { farmId } = useAuth();
  const navigate = useNavigate();
  const [ponds, setPonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPonds();
  }, []);

  const fetchPonds = async () => {
    try {
      const response = await pondAPI.getAll(farmId);
      setPonds(response.data.data || []);
    } catch (error) {
      console.error('Failed to load ponds');
    } finally {
      setLoading(false);
    }
  };

  const handlePondCreated = () => {
    setShowForm(false);
    fetchPonds();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.75rem', fontWeight: 700, color: 'white',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            Your Ponds
            <span style={{ fontSize: '1.75rem' }}>🦐</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {ponds.length} {ponds.length === 1 ? 'pond' : 'ponds'} registered
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="pond-add-btn"
        >
          <span style={{ fontSize: '1.1rem' }}>+</span>
          Add Pond
        </button>
      </div>

      {/* Add Pond Form Modal */}
      {showForm && (
        <PondForm
          farmId={farmId}
          onSuccess={handlePondCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Ponds Grid or Empty State */}
      {ponds.length === 0 ? (
        <div className="pond-empty-state">
          <span style={{ fontSize: '4rem', marginBottom: '1rem', display: 'block' }}>🦐</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>
            No Ponds Yet
          </h3>
          <p style={{ color: '#94A3B8', marginBottom: '1.5rem', textAlign: 'center', maxWidth: '300px' }}>
            Add your first pond to start tracking your prawn farming journey
          </p>
          <button onClick={() => setShowForm(true)} className="pond-add-btn">
            + Add Your First Pond
          </button>
        </div>
      ) : (
        <div className="pond-grid">
          {ponds.map((pond) => (
            <div
              key={pond.id}
              onClick={() => navigate(`/ponds/${pond.id}`)}
              className="pond-card"
            >
              {/* Top Row: Name + Culture Day */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                marginBottom: '1.25rem'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 className="pond-card-name">{pond.pondName}</h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                    {pond.sizeAcre} Acre • {pond.prawnType}
                  </p>
                </div>
                <div style={{
                  textAlign: 'right', background: '#0F172A', borderRadius: '0.75rem',
                  padding: '0.5rem 1rem', border: '1px solid #334155'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0EA5E9', fontFamily: 'monospace' }}>
                    Day {pond.cultureDay}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>of 120 days</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem',
                marginBottom: '1.25rem'
              }}>
                <div className="pond-stat-box">
                  <p className="pond-stat-label">Weight</p>
                  <p className="pond-stat-value">
                    {pond.latestWeight ? `${pond.latestWeight}g` : '—'}
                  </p>
                </div>
                <div className="pond-stat-box">
                  <p className="pond-stat-label">Survival</p>
                  <p className="pond-stat-value">
                    {pond.survivalRate ? `${pond.survivalRate}%` : '—'}
                  </p>
                </div>
                <div className="pond-stat-box">
                  <p className="pond-stat-label">Total Feed</p>
                  <p className="pond-stat-value">
                    {pond.totalFeedKg || 0}
                    <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#94A3B8', marginLeft: '2px' }}>kg</span>
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontSize: '0.75rem', marginBottom: '0.5rem'
                }}>
                  <span style={{ color: '#94A3B8', fontWeight: 500 }}>
                    {pond.growthStage?.replace('_', ' ')}
                  </span>
                  <span style={{ color: '#0EA5E9', fontWeight: 700 }}>
                    {Math.round((pond.cultureDay / 120) * 100)}%
                  </span>
                </div>
                <div style={{
                  height: '10px', background: '#0F172A', borderRadius: '999px',
                  overflow: 'hidden', border: '1px solid #334155'
                }}>
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #0EA5E9, #22C55E, #10B981)',
                    borderRadius: '999px',
                    transition: 'width 0.5s ease',
                    width: `${Math.min((pond.cultureDay / 120) * 100, 100)}%`
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}