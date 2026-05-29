import React, { useMemo } from 'react';

export default function HistogramPanel({ data }) {
  if (!data || !data.gray) return (
      <div className="w-full h-32 bg-slate-900/50 rounded-xl flex items-center justify-center border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Aucune donnée</span>
      </div>
  );

  // Normalize data for SVG height (max 100)
  const normalizedData = useMemo(() => {
    const max = Math.max(...data.gray, 1);
    return data.gray.map(val => (val / max) * 100);
  }, [data.gray]);

  return (
    <div className="w-full h-32 bg-slate-900/50 rounded-xl p-4 border border-slate-800 relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <svg 
        viewBox="0 0 256 100" 
        preserveAspectRatio="none" 
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {normalizedData.map((val, i) => (
          <rect
            key={i}
            x={i}
            y={100 - val}
            width="1"
            height={val}
            fill="url(#barGradient)"
            className="transition-all duration-500 ease-out"
          />
        ))}
      </svg>
      
      {/* Legend overlays */}
      <div className="absolute bottom-1 left-2 text-[8px] text-slate-600 font-bold uppercase">0</div>
      <div className="absolute bottom-1 right-2 text-[8px] text-slate-600 font-bold uppercase">255</div>
    </div>
  );
}
