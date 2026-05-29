import React from 'react';

export default function PixelMatrix({ matrix }) {
    if (!matrix || matrix.length === 0) return null;

    return (
        <div className="w-full bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-auto max-h-64 custom-scrollbar">
            <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Matrice de pixels (RGB)</h5>
            <div className="inline-block min-w-full">
                {matrix.map((row, y) => (
                    <div key={y} className="flex gap-1 mb-1 whitespace-nowrap">
                        {row.map((pixel, x) => (
                            <div 
                                key={x} 
                                className="w-10 h-10 flex flex-col items-center justify-center text-[8px] font-mono rounded border border-slate-800 transition-colors hover:border-slate-600"
                                style={{ backgroundColor: `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})` }}
                            >
                                <span className={`drop-shadow-sm ${ (pixel[0]+pixel[1]+pixel[2])/3 > 128 ? 'text-black' : 'text-white' }`}>{pixel[0]}</span>
                                <span className={`drop-shadow-sm ${ (pixel[0]+pixel[1]+pixel[2])/3 > 128 ? 'text-black' : 'text-white' }`}>{pixel[1]}</span>
                                <span className={`drop-shadow-sm ${ (pixel[0]+pixel[1]+pixel[2])/3 > 128 ? 'text-black' : 'text-white' }`}>{pixel[2]}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
