// src/pages/PondDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pondAPI, feedAPI, growthAPI } from "../api/axios";
import GrowthCurve from "../components/charts/GrowthCurve";
import { formatDate } from "../utils/date";
import FeedChart from "../components/charts/FeedChart";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function PondDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pond, setPond] = useState(null);
  const [feedHistory, setFeedHistory] = useState([]);
  const [growthHistory, setGrowthHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    try {
      const [pondRes, feedRes, growthRes] = await Promise.all([
        pondAPI.getById(id),
        feedAPI.getByPond(id),
        growthAPI.getByPond(id),
      ]);
      setPond(pondRes.data.data);
      setFeedHistory(feedRes.data.data || []);
      setGrowthHistory(growthRes.data.data || []);
    } catch (error) {
      console.error("Failed to load pond details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!pond) return <div className="text-white p-4">Pond not found</div>;

  const tabs = [
    { key: "overview", label: "📊 Overview" },
    { key: "feed", label: "🍤 Feed" },
    { key: "growth", label: "📈 Growth" },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Main container with proper width constraints */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/ponds")}
          className="text-[#94A3B8] hover:text-white text-sm flex items-center gap-1 transition-colors"
        >
          ← Back to Ponds
        </button>

        {/* Pond Header */}
        <div className="bg-gradient-to-r from-[#0EA5E9]/20 to-[#22C55E]/10 border border-[#0EA5E9]/20 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{pond.pondName}</h1>
              <p className="text-[#94A3B8] mt-1">
                {pond.sizeAcre} Acre • {pond.prawnType} •{" "}
                {pond.seedCount?.toLocaleString()} seeds
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-[#0EA5E9] font-mono">
                {pond.cultureDay}
              </div>
              <div className="text-sm text-[#94A3B8]">/ 120 days</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-3 bg-[#1E293B] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#22C55E] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((pond.cultureDay / 120) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-[#94A3B8] text-xs mt-2">
              Stage: {pond.growthStage?.replace("_", " ")} • Stocked:{" "}
              {formatDate(pond.stockingDate)}
            </p>
          </div>
        </div>

        {/* Key Metrics - Responsive grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Current Weight"
            value={pond.latestWeight ? `${pond.latestWeight}g` : "—"}
          />
          <MetricCard
            label="Survival Rate"
            value={pond.survivalRate ? `${pond.survivalRate}%` : "—"}
          />
          <MetricCard
            label="Biomass"
            value={pond.biomass ? `${Math.round(pond.biomass)} kg` : "—"}
          />
          <MetricCard
            label="Total Feed"
            value={`${pond.totalFeedKg || 0} kg`}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-[#1E293B] rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all
                ${
                  activeTab === tab.key
                    ? "bg-[#0EA5E9] text-white"
                    : "text-[#94A3B8] hover:text-white"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/feed/add")}
                className="py-3 bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 
                           text-[#0EA5E9] rounded-xl font-medium hover:bg-[#0EA5E9]/20
                           transition-all duration-200"
              >
                🍤 Add Feed
              </button>
              <button
                onClick={() => navigate("/growth/add")}
                className="py-3 bg-[#22C55E]/10 border border-[#22C55E]/30 
                           text-[#22C55E] rounded-xl font-medium hover:bg-[#22C55E]/20
                           transition-all duration-200"
              >
                📊 Add Sample
              </button>
            </div>

            {/* Recent Feed */}
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">
                Recent Feed Entries
              </h3>
              {feedHistory.length === 0 ? (
                <p className="text-[#94A3B8] text-sm">No feed entries yet</p>
              ) : (
                <div className="space-y-2">
                  {feedHistory.slice(0, 5).map((entry) => (
                    <div
                      key={entry.id}
                      className="flex justify-between items-center py-2 
                                 border-b border-[#334155]/50 last:border-0"
                    >
                      <div>
                        <span className="text-white text-sm">
                          {formatDate(entry.feedDate)}
                        </span>
                        <span className="text-[#94A3B8] text-xs ml-2">
                          {entry.feedTime}
                        </span>
                      </div>
                      <span className="text-[#22C55E] font-bold font-mono">
                        {entry.quantityKg} kg
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "feed" && (
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
            <FeedChart data={feedHistory} />
          </div>
        )}

        {activeTab === "growth" && (
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
            <GrowthCurve data={growthHistory} />
          </div>
        )}
      </div>
    </div>
  );
}

// Small helper component
function MetricCard({ label, value }) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 text-center hover:border-[#0EA5E9]/30 transition-colors">
      <p className="text-[#94A3B8] text-[11px] uppercase tracking-wide">
        {label}
      </p>
      <p className="text-white text-xl font-bold mt-1 font-mono">{value}</p>
    </div>
  );
}
