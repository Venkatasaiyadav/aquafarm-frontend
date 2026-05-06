// src/components/common/LoadingSpinner.jsx
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F172A]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#334155] border-t-[#0EA5E9] 
                        rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#94A3B8] text-lg">Loading AquaFarm Pro...</p>
        <p className="text-3xl mt-2">🦐</p>
      </div>
    </div>
  );
}