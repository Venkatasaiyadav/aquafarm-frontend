// src/components/common/StatCard.jsx

export default function StatCard({
  title,
  value,
  icon,
  color = "blue",
  subtitle,
}) {
  const themes = {
    blue: {
      bg: "bg-gradient-to-br from-[#0EA5E9]/15 to-[#0EA5E9]/5",
      border: "border-[#0EA5E9]/25",
      iconBg: "bg-gradient-to-br from-[#0EA5E9]/30 to-[#0EA5E9]/10",
      glow: "shadow-[0_0_20px_rgba(14,165,233,0.08)]",
      accent: "text-[#38BDF8]",
      bar: "bg-[#0EA5E9]",
    },
    green: {
      bg: "bg-gradient-to-br from-[#22C55E]/15 to-[#22C55E]/5",
      border: "border-[#22C55E]/25",
      iconBg: "bg-gradient-to-br from-[#22C55E]/30 to-[#22C55E]/10",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.08)]",
      accent: "text-[#4ADE80]",
      bar: "bg-[#22C55E]",
    },
    orange: {
      bg: "bg-gradient-to-br from-[#F59E0B]/15 to-[#F59E0B]/5",
      border: "border-[#F59E0B]/25",
      iconBg: "bg-gradient-to-br from-[#F59E0B]/30 to-[#F59E0B]/10",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.08)]",
      accent: "text-[#FBBF24]",
      bar: "bg-[#F59E0B]",
    },
    purple: {
      bg: "bg-gradient-to-br from-[#8B5CF6]/15 to-[#8B5CF6]/5",
      border: "border-[#8B5CF6]/25",
      iconBg: "bg-gradient-to-br from-[#8B5CF6]/30 to-[#8B5CF6]/10",
      glow: "shadow-[0_0_20px_rgba(139,92,246,0.08)]",
      accent: "text-[#A78BFA]",
      bar: "bg-[#8B5CF6]",
    },
  };

  const t = themes[color] || themes.blue;

  return (
    <div
      className={`${t.bg} ${t.border} ${t.glow} border rounded-2xl p-4 md:p-5
                   backdrop-blur-sm transition-all duration-300
                   hover:scale-[1.02] hover:shadow-lg cursor-default`}
    >
      {/* Top accent bar */}
      <div className={`h-0.5 ${t.bar} rounded-full w-8 mb-3 opacity-60`} />

      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center
                      rounded-xl ${t.iconBg} backdrop-blur-sm`}
        >
          <span className="text-xl sm:text-2xl">{icon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[#94A3B8] text-[11px] sm:text-xs font-medium uppercase tracking-wider truncate">
            {title}
          </p>
          <p className={`${t.accent} text-lg sm:text-xl md:text-2xl font-bold mt-0.5 truncate`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-[#94A3B8] text-xs mt-1 truncate">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
