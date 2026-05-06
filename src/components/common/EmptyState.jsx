// src/components/common/EmptyState.jsx
export default function EmptyState({
  icon = '📭',
  title = 'No Data Yet',
  message = 'Start by adding some data',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <span className="text-6xl mb-4">{icon}</span>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-[#94A3B8] text-center mb-6 max-w-md">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] 
                     text-white rounded-xl font-medium transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}