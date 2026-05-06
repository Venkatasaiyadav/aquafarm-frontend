// src/components/dashboard/AlertsPanel.jsx

export default function AlertsPanel({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => {
        const isWarning = alert.includes('⚠️');
        const isHarvest = alert.includes('🦐');

        let style = 'bg-blue-500/10 border-blue-500/25 text-blue-200';
        if (isWarning) style = 'bg-amber-500/10 border-amber-500/25 text-amber-200';
        if (isHarvest) style = 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200';

        return (
          <div
            key={index}
            className={`${style} border rounded-xl px-4 py-3 
                       text-sm backdrop-blur-sm`}
          >
            {alert}
          </div>
        );
      })}
    </div>
  );
}