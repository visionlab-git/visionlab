import React from 'react';
import {
  Sliders,
  Grid3X3,
  Activity,
  Component,
  Scissors,
  Binary,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ activeModule, setActiveModule, onOpenSupport }) {
  const chapters = [
    {
      id: 'base',
      title: 'Chapitre 1',
      name: 'Traitement de base',
      icon: <Sliders className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-400'
    },
    {
      id: 'convolution',
      title: 'Chapitre 2',
      name: 'Convolution',
      icon: <Grid3X3 className="w-5 h-5" />,
      color: 'from-purple-500 to-indigo-400'
    },
    {
      id: 'fourier',
      title: 'Chapitre 3',
      name: 'Transformée de Fourier',
      icon: <Activity className="w-5 h-5" />,
      color: 'from-pink-500 to-rose-400'
    },
    {
      id: 'contours',
      title: 'Chapitre 4',
      name: 'Les contours',
      icon: <Scissors className="w-5 h-5" />,
      color: 'from-orange-500 to-amber-400'
    },
    {
      id: 'segmentation',
      title: 'Chapitre 5',
      name: 'Segmentation',
      icon: <Component className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-400'
    },
    {
      id: 'binary',
      title: 'Chapitre 6',
      name: 'Les images binaires',
      icon: <Binary className="w-5 h-5" />,
      color: 'from-teal-500 to-cyan-400'
    }
  ];

  return (
    <aside className="w-64 glass border-r border-slate-800/50 flex flex-col z-20 h-screen transition-all duration-300">
      <div className="p-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/20 border border-slate-700/50">
            <img src="/logo.png" alt="VisionLab Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">Vision<span className="text-blue-500">Lab</span></h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-[0.2em] uppercase">Digital Image Processing</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 custom-scrollbar">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => setActiveModule(chapter.id)}
            className={`w-full group relative flex flex-col p-3 rounded-xl transition-all duration-300 ${activeModule === chapter.id
                ? 'bg-slate-800/50 border border-slate-700/50 shadow-xl'
                : 'hover:bg-slate-800/30 border border-transparent'
              }`}
          >
            {activeModule === chapter.id && (
              <div className={`absolute top-1/2 -left-1 -translate-y-1/2 w-1 h-12 rounded-full bg-gradient-to-b ${chapter.color} shadow-[0_0_15px_rgba(59,130,246,0.5)]`}></div>
            )}

            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${activeModule === chapter.id ? 'text-blue-400' : 'text-slate-500'
                }`}>
                {chapter.title}
              </span>
              <div className={`p-2 rounded-lg transition-colors ${activeModule === chapter.id
                  ? `bg-gradient-to-br ${chapter.color} text-white shadow-lg`
                  : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                }`}>
                {chapter.icon}
              </div>
            </div>

            <div className="flex items-center justify-between mt-1">
              <span className={`text-sm font-semibold transition-colors ${activeModule === chapter.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                {chapter.name}
              </span>
              <ChevronRight size={14} className={`transition-transform duration-300 ${activeModule === chapter.id ? 'translate-x-0 opacity-100 text-blue-400' : '-translate-x-2 opacity-0'
                }`} />
            </div>
          </button>
        ))}
      </div>

      <div className="p-6 border-t border-slate-800/50 bg-slate-950/50 space-y-4">
        <button
          onClick={onOpenSupport}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 transition-all group"
        >
          <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-600/20 group-hover:rotate-12 transition-transform">
            <HelpCircle size={18} />
          </div>
          <div className="text-left">
            <p className="text-[11px] text-white font-bold uppercase tracking-wider">Aide & Support</p>
            <p className="text-[9px] text-blue-400 font-medium">Guide et Contacts</p>
          </div>
        </button>
      </div>
    </aside>
  );
}

function LayersIcon({ size, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
