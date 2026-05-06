// src/components/pond/PondCard.jsx

/*
 📚 LEARN: Single Responsibility
 
 PondCard = ONE pond's card display
 PondCards (dashboard) = renders MULTIPLE PondCards
 
 This component is used in:
 - Dashboard (horizontal scroll)
 - Ponds list page (grid layout)
 - Any place we need to show a pond summary
 
 REUSABLE = write once, use everywhere
*/

import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date";

const stageConfig = {
  NURSERY: {
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    icon: "🥚",
    label: "Nursery",
  },
  JUVENILE: {
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: "🦐",
    label: "Juvenile",
  },
  GROW_OUT: {
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: "💪",
    label: "Grow Out",
  },
  HARVEST_READY: {
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: "🎣",
    label: "Harvest Ready",
  },
};

const borderColors = [
  "border-l-blue-500",
  "border-l-green-500",
  "border-l-purple-500",
  "border-l-orange-500",
];

export default function PondCard({ pond, index = 0, compact = false }) {
  const navigate = useNavigate();
  const stage = stageConfig[pond.growthStage] || stageConfig.NURSERY;
  const progress = Math.min((pond.cultureDay / 120) * 100, 100);

  const handleClick = () => {
    navigate(`/ponds/${pond.id}`);
  };

  // Compact version for dashboard horizontal scroll
  if (compact) {
    return (
      <div
        onClick={handleClick}
        className={`min-w-[200px] bg-[#1E293B] border border-[#334155] rounded-xl p-3
                   border-l-4 ${borderColors[index % 4]}
                   cursor-pointer hover:bg-[#243044] transition-all
                   hover:scale-[1.02] flex-shrink-0`}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-white font-semibold text-sm">{pond.pondName}</h4>
          <span className="text-xs">{stage.icon}</span>
        </div>
        <div className="text-[#94A3B8] text-xs space-y-1">
          <div className="flex justify-between">
            <span>Day</span>
            <span className="text-white font-mono">{pond.cultureDay}/120</span>
          </div>
          <div className="flex justify-between">
            <span>Weight</span>
            <span className="text-white">
              {pond.latestWeight ? `${pond.latestWeight}g` : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Feed</span>
            <span className="text-[#22C55E] font-semibold">
              {pond.todayFeedKg || 0} kg
            </span>
          </div>
        </div>
        {/* Mini Progress Bar */}
        <div className="mt-2 h-1 bg-[#334155] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#22C55E] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  // Full version for Ponds list page
  return (
    <div
      onClick={handleClick}
      className={`bg-[#1E293B] border border-[#334155] rounded-xl p-5
                 border-l-4 ${borderColors[index % 4]}
                 cursor-pointer hover:bg-[#243044] hover:border-[#0EA5E9]/30
                 transition-all hover:scale-[1.01]`}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{pond.pondName}</h3>
          <p className="text-[#94A3B8] text-sm mt-0.5">
            {pond.sizeAcre} Acre • {pond.prawnType}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-[10px] px-2.5 py-1 rounded-full border font-medium
                       ${stage.color}`}
          >
            {stage.icon} {stage.label}
          </span>
          <span className="text-[#0EA5E9] text-2xl font-bold font-mono">
            Day {pond.cultureDay}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatBox
          label="Weight"
          value={pond.latestWeight ? `${pond.latestWeight}g` : "—"}
        />
        <StatBox
          label="Survival"
          value={pond.survivalRate ? `${pond.survivalRate}%` : "—"}
        />
        <StatBox label="Total Feed" value={`${pond.totalFeedKg || 0} kg`} />
      </div>

      {/* Additional Info */}
      <div className="flex items-center justify-between text-sm mb-3">
        <span className="text-[#94A3B8]">
          Seeds: {(pond.seedCount || 0).toLocaleString()}
        </span>
        <span className="text-[#94A3B8]">
          Stocked: {formatDate(pond.stockingDate)}
        </span>
      </div>

      {/* Today's Feed Highlight */}
      <div className="flex items-center justify-between bg-[#0F172A] rounded-lg px-3 py-2 mb-3">
        <span className="text-[#94A3B8] text-sm">Today's Feed</span>
        <span className="text-[#22C55E] font-bold font-mono text-lg">
          {pond.todayFeedKg || 0} kg
        </span>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
          <span>Culture Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-[#334155] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#22C55E] 
                       rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Internal helper component
function StatBox({ label, value }) {
  return (
    <div className="bg-[#0F172A] rounded-lg p-2.5 text-center">
      <p className="text-[#94A3B8] text-[10px] uppercase tracking-wide">
        {label}
      </p>
      <p className="text-white font-bold text-base mt-0.5 font-mono">{value}</p>
    </div>
  );
}
