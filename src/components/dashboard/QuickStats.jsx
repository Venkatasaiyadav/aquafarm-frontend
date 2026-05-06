// src/components/dashboard/QuickStats.jsx

/*
 📚 LEARN: Component Composition
 
 QuickStats uses StatCard internally.
 This is "composition" — building complex UI 
 from smaller reusable pieces.
 
 Dashboard uses QuickStats (not individual StatCards)
 QuickStats uses StatCard for each metric
 
 Dashboard → QuickStats → StatCard (×4)
*/

import StatCard from '../common/StatCard';

export default function QuickStats({ dashboard }) {

  // Format large Indian numbers
  const formatINR = (amount) => {
    if (!amount || amount === 0) return '₹0';
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  const stats = [
    {
      title: 'Active Ponds',
      value: dashboard?.activePondCount || 0,
      icon: '🦐',
      color: 'blue',
      subtitle: `${dashboard?.activePondCount || 0} ponds running`,
    },
    {
      title: "Today's Feed",
      value: `${dashboard?.todayTotalFeedKg || 0} kg`,
      icon: '🍤',
      color: 'green',
      subtitle: `${((dashboard?.todayTotalFeedKg || 0) / 25).toFixed(1)} bags`,
    },
    {
      title: 'Total Spent',
      value: formatINR(dashboard?.totalExpense || 0),
      icon: '💰',
      color: 'orange',
      subtitle: 'All expenses combined',
    },
    {
      title: 'Est. Revenue',
      value: formatINR(dashboard?.estimatedRevenue || 0),
      icon: '📈',
      color: 'purple',
      subtitle: 'Based on current biomass',
    },
  ];

  // Calculate profit
  const profit = (dashboard?.estimatedRevenue || 0) - (dashboard?.totalExpense || 0);
  const profitPercent = dashboard?.totalExpense > 0
    ? ((profit / dashboard.totalExpense) * 100).toFixed(0)
    : 0;

  return (
    <div className="space-y-4">
      {/* Main 4 Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      {/* Profit Banner */}
      {dashboard?.totalExpense > 0 && (
        <div
          className={`rounded-xl p-4 border flex items-center justify-between
            ${profit >= 0
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
            }`}
        >
          <div>
            <p className={`text-sm ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              Expected {profit >= 0 ? 'Profit' : 'Loss'}
            </p>
            <p className="text-white text-2xl font-bold font-mono">
              {formatINR(Math.abs(profit))}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[#94A3B8] text-xs">Margin</p>
            <p className={`text-xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {profit >= 0 ? '+' : ''}{profitPercent}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}