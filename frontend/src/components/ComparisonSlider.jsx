import React, { useState, useRef, useEffect } from 'react';

export default function ComparisonSlider({ original, current, width, height }) {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        setSliderPos(Math.max(0, Math.min(100, x)));
    };

    const handleTouchMove = (e) => {
        if (!containerRef.current || !e.touches[0]) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
        setSliderPos(Math.max(0, Math.min(100, x)));
    };

    return (
        <div 
            ref={containerRef}
            className="relative select-none cursor-ew-resize rounded-xl overflow-hidden shadow-2xl border border-slate-700"
            style={{ width, height }}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            {/* After Image (Full width) */}
            <img 
                src={current} 
                alt="After" 
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Before Image (Clipped) */}
            <div 
                className="absolute inset-0 overflow-hidden border-r-2 border-white/50"
                style={{ width: `${sliderPos}%` }}
            >
                <img 
                    src={original} 
                    alt="Before" 
                    style={{ width, height }}
                    className="max-w-none object-contain pointer-events-none"
                />
            </div>

            {/* Slider Handle */}
            <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] z-20 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center">
                    <div className="flex gap-1">
                        <div className="w-0.5 h-3 bg-white/80 rounded-full"></div>
                        <div className="w-0.5 h-3 bg-white/80 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-wider z-30 pointer-events-none">Avant</div>
            <div className="absolute top-4 right-4 px-2 py-1 bg-blue-600/50 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-wider z-30 pointer-events-none">Après</div>
        </div>
    );
}
