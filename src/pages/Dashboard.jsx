// src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dashboardAPI } from "../api/axios";
import StatCard from "../components/common/StatCard";
import PondCards from "../components/dashboard/PondCards";
import TodayFeed from "../components/dashboard/TodayFeed";
import AlertsPanel from "../components/dashboard/AlertsPanel";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Dashboard() {
  const { user, farmId } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, [farmId]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.get(farmId);
      setDashboard(response.data.data);
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!dashboard)
    return <div style={{ color: 'white' }}>Failed to load dashboard</div>;

  const formatCurrency = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
      {/* Greeting */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
          Good {getGreeting()}, {user?.fullName} 👋
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
          {dashboard.farmName} • {dashboard.activePondCount} Active Ponds
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem', marginBottom: '1.25rem'
      }}>
        <StatCard title="Active Ponds" value={dashboard.activePondCount} icon="🦐" color="blue" />
        <StatCard title="Today's Feed" value={`${dashboard.todayTotalFeedKg || 0} kg`} icon="🍤" color="green" />
        <StatCard title="Total Spent" value={formatCurrency(dashboard.totalExpense || 0)} icon="💰" color="orange" />
        <StatCard title="Est. Revenue" value={formatCurrency(dashboard.estimatedRevenue || 0)} icon="📈" color="purple" />
      </div>

      {/* Alerts */}
      {dashboard.alerts && dashboard.alerts.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <AlertsPanel alerts={dashboard.alerts} />
        </div>
      )}

      {/* Pond Cards */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}>
          <h2 className="dash-section-title">
            <span className="dash-title-bar dash-title-bar-blue" />
            Your Ponds
          </h2>
          <button
            onClick={() => navigate("/ponds")}
            className="dash-view-all-btn"
          >
            View All <span style={{ fontSize: '0.75rem' }}>→</span>
          </button>
        </div>
        <PondCards ponds={dashboard.ponds || []} />
      </div>

      {/* Today's Feed Summary */}
      <TodayFeed ponds={dashboard.ponds || []} />
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}
