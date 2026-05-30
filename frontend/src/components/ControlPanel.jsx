import React from 'react';
import { 
  Settings2, 
  Sparkles, 
  BarChart3, 
  Layers, 
  Maximize, 
  Minimize, 
  RefreshCw,
  PlusCircle,
  Hash,
  Move,
  Scissors,
  Sun,
  Contrast as ContrastIcon,
  Zap,
  Box,
  Activity
} from 'lucide-react';
import HistogramPanel from './HistogramPanel';

export default function ControlPanel({ 
    activeModule, 
    config, 
    setConfig, 
    histogramData, 
    onSecondImageUpload,
    hasSecondImage 
}) {
  const commonBtnClass = (active, colorClass) => `px-3 py-2.5 text-[10px] md:text-[11px] font-bold rounded-xl transition-all border uppercase tracking-wider ${
    active 
      ? `${colorClass} border-transparent shadow-lg text-white` 
      : 'bg-slate-800/40 text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-slate-200'
  }`;

  const resetFilters = () => {
    setConfig({
      brightness: 0,
      contrast: 0,
      grayscale: false,
      invert: false,
      threshold: 0,
      equalize: false,
      filter: 'none',
      method: 'none',
      operation: 'none',
      interpolation: 'none',
      arithmetic: 'none',
      showMatrix: false
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => onSecondImageUpload(event.target.result, img);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full lg:w-80 glass-panel rounded-2xl md:rounded-3xl p-5 md:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar border border-slate-800/50 shadow-2xl relative z-20 max-h-[50vh] lg:max-h-full">
      <div className="flex items-center justify-between border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600/10 rounded-lg text-blue-400">
                <Settings2 size={16} />
            </div>
            <h3 className="font-bold text-slate-200 uppercase tracking-[0.15em] text-[11px] md:text-xs">Paramètres</h3>
        </div>
        <button onClick={resetFilters} className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-xl transition-colors group" title="Réinitialiser">
            <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      <div className="flex-1 space-y-8">
        {activeModule === 'base' && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* 1. Histogramme */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 size={12} className="text-blue-500" /> 1. Histogramme
                </h4>
                <HistogramPanel data={histogramData} />
            </div>

            {/* 2 & 3. Luminance & Contraste */}
            <div className="pt-4 border-t border-slate-800/50 space-y-5">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Sun size={12} className="text-amber-500" /> 2 & 3. Brillance & Contraste
                </h4>
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Luminosité</label>
                        <span className="text-blue-400 font-mono text-xs">{config.brightness}</span>
                    </div>
                    <input type="range" min="-100" max="100" value={config.brightness} onChange={(e) => setConfig({...config, brightness: parseInt(e.target.value)})} className="w-full" />
                </div>
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contraste</label>
                        <span className="text-purple-400 font-mono text-xs">{config.contrast}</span>
                    </div>
                    <input type="range" min="-100" max="100" value={config.contrast} onChange={(e) => setConfig({...config, contrast: parseInt(e.target.value)})} className="w-full" />
                </div>
            </div>

            {/* 4 & 5. Correction & Égalisation */}
            <div className="pt-4 border-t border-slate-800/50 space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Zap size={12} className="text-purple-500" /> 4 & 5. Correction & Égalisation
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setConfig({...config, grayscale: !config.grayscale})} className={commonBtnClass(config.grayscale, 'bg-blue-600')}>Gris</button>
                    <button onClick={() => setConfig({...config, invert: !config.invert})} className={commonBtnClass(config.invert, 'bg-indigo-600')}>Négatif</button>
                    <button onClick={() => setConfig({...config, equalize: !config.equalize})} className={commonBtnClass(config.equalize, 'bg-purple-600 col-span-2')}>Égalisation d'histogramme</button>
                </div>
            </div>

            {/* 6. Opérations sur les images */}
            <div className="pt-4 border-t border-slate-800/50 space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <PlusCircle size={12} className="text-green-500" /> 6. Opérations sur images
                </h4>
                <div className="grid grid-cols-3 gap-1">
                    {['add', 'sub', 'mult'].map(op => (
                        <button key={op} onClick={() => setConfig({...config, arithmetic: config.arithmetic === op ? 'none' : op})} className={commonBtnClass(config.arithmetic === op, 'bg-green-600')}>{op}</button>
                    ))}
                </div>
                {config.arithmetic !== 'none' && !hasSecondImage && (
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-blue-500/50 transition-all bg-slate-900/40">
                        <PlusCircle size={20} className="text-slate-500 mb-2" />
                        <span className="text-[9px] text-slate-500 uppercase font-bold text-center">Ajouter Image 2</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                )}
            </div>

            {/* 7. Interpolation */}
            <div className="pt-4 border-t border-slate-800/50 space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Move size={12} className="text-orange-500" /> 7. Interpolation d'image
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setConfig({...config, interpolation: config.interpolation === 'nearest' ? 'none' : 'nearest'})} className={commonBtnClass(config.interpolation === 'nearest', 'bg-orange-600')}>P. Voisin</button>
                    <button onClick={() => setConfig({...config, interpolation: config.interpolation === 'bilinear' ? 'none' : 'bilinear'})} className={commonBtnClass(config.interpolation === 'bilinear', 'bg-amber-600')}>Bilinéaire</button>
                </div>
            </div>

            {/* 8. Super Résolution */}
            <div className="pt-4 border-t border-slate-800/50 space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Maximize size={12} className="text-blue-400" /> 8. Super Résolution
                </h4>
                <div className="grid grid-cols-1 gap-2">
                    <select 
                        value={config.upscale} 
                        onChange={(e) => setConfig({...config, upscale: e.target.value})}
                        className="bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-300 uppercase focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                    >
                        <option value="none">Standard</option>
                        <option value="700">700px (HD Ready)</option>
                        <option value="1024">1024px (Full HD)</option>
                        <option value="2k">2048px (2K Ultra)</option>
                        <option value="5k">5120px (5K Retina)</option>
                        <option value="10k">10240px (10K - Risqué)</option>
                    </select>
                    <p className="text-[8px] text-slate-600 uppercase tracking-widest text-center px-1">Améliore la clarté par interpolation et filtrage de netteté.</p>
                </div>
            </div>

            {/* 9. Recadrage */}
            <div className="pt-4 border-t border-slate-800/50 space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Scissors size={12} className="text-red-500" /> 9. Recadrage
                </h4>
                <button 
                  onClick={() => setConfig({...config, crop: {...config.crop, active: !config.crop.active}})} 
                  className={commonBtnClass(config.crop.active, 'bg-red-600 w-full')}
                >
                  {config.crop.active ? 'Désactiver' : 'Activer le Recadrage'}
                </button>
                
                {config.crop.active && (
                  <div className="space-y-4 pt-2 animate-in fade-in zoom-in duration-300">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase tracking-tighter">X (%)</label>
                        <input type="range" min="0" max="90" value={config.crop.x} onChange={(e) => setConfig({...config, crop: {...config.crop, x: parseInt(e.target.value)}})} className="w-full h-1" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase tracking-tighter">Y (%)</label>
                        <input type="range" min="0" max="90" value={config.crop.y} onChange={(e) => setConfig({...config, crop: {...config.crop, y: parseInt(e.target.value)}})} className="w-full h-1" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase tracking-tighter">Larg (%)</label>
                        <input type="range" min="10" max={100 - config.crop.x} value={config.crop.width} onChange={(e) => setConfig({...config, crop: {...config.crop, width: parseInt(e.target.value)}})} className="w-full h-1" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase tracking-tighter">Haut (%)</label>
                        <input type="range" min="10" max={100 - config.crop.y} value={config.crop.height} onChange={(e) => setConfig({...config, crop: {...config.crop, height: parseInt(e.target.value)}})} className="w-full h-1" />
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* 8. Matrice de pixels */}
            <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Hash size={12} /> 8. Matrice de pixels
                </span>
                <button onClick={() => setConfig({...config, showMatrix: !config.showMatrix})} className={`w-10 h-5 rounded-full transition-colors relative ${config.showMatrix ? 'bg-blue-600' : 'bg-slate-700'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all ${config.showMatrix ? 'left-6' : 'left-1'}`}></div>
                </button>
            </div>
          </section>
        )}

        {activeModule === 'convolution' && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* 1. Convolution numérique */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Box size={12} className="text-slate-400" /> 1. Convolution Numérique
                </h4>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <p className="text-[9px] text-slate-400 font-mono leading-tight">
                        L'opération discrète calcule la valeur d'un pixel par la somme pondérée de ses voisins.<br/><br/>
                        <span className="text-blue-400">Sum (Image[x,y] * Kernel[i,j])</span>
                    </p>
                </div>
            </div>

            {/* 2. Filtres Passe-bas / Passe-haut */}
            <div className="pt-4 border-t border-slate-800/50 space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Layers size={12} className="text-indigo-500" /> 2. Passe-haut / Passe-bas
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setConfig({...config, filter: config.filter === 'lowpass_std' ? 'none' : 'lowpass_std'})} className={commonBtnClass(config.filter === 'lowpass_std', 'bg-blue-600')}>Passe-bas (Std)</button>
                    <button onClick={() => setConfig({...config, filter: config.filter === 'highpass' ? 'none' : 'highpass'})} className={commonBtnClass(config.filter === 'highpass', 'bg-rose-600')}>Passe-haut</button>
                    <button onClick={() => setConfig({...config, filter: config.filter === 'lowpass_fft' ? 'none' : 'lowpass_fft'})} className={commonBtnClass(config.filter === 'lowpass_fft', 'bg-purple-600 col-span-2')}>Passe-bas (FFT)</button>
                </div>
            </div>

            {/* 3. Filtrage moyen */}
            <div className="pt-4 border-t border-slate-800/50 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">3. Filtrage Moyen</h4>
                <button onClick={() => setConfig({...config, filter: config.filter === 'mean' ? 'none' : 'mean'})} className={commonBtnClass(config.filter === 'mean', 'bg-blue-600 w-full')}>Filtre de Moyenne</button>
            </div>

            {/* 4. Filtrage gaussien */}
            <div className="pt-4 border-t border-slate-800/50 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">4. Filtrage Gaussien</h4>
                <button onClick={() => setConfig({...config, filter: config.filter === 'gaussian' ? 'none' : 'gaussian'})} className={commonBtnClass(config.filter === 'gaussian', 'bg-indigo-600 w-full')}>Lissage Gaussien</button>
            </div>

            {/* 5. Filtre médian */}
            <div className="pt-4 border-t border-slate-800/50 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">5. Filtre Médian</h4>
                <button onClick={() => setConfig({...config, filter: config.filter === 'median' ? 'none' : 'median'})} className={commonBtnClass(config.filter === 'median', 'bg-pink-600 w-full')}>Médian (Anti-bruit)</button>
            </div>
          </section>
        )}

        {/* Chapters 3 to 6 follow a similar rigid structure if needed */}
        {activeModule === 'fourier' && (
           <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Activity size={12} className="text-blue-500" /> Analyse Fréquentielle
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                        <button 
                            onClick={() => setConfig({...config, filter: config.filter === 'spectrum' ? 'none' : 'spectrum'})} 
                            className={commonBtnClass(config.filter === 'spectrum', 'bg-blue-600')}
                        >
                            Spectre de Magnitude
                        </button>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-800/50 space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Filtres de Fourier</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => setConfig({...config, filter: config.filter === 'lowpass_fft' ? 'none' : 'lowpass_fft'})} 
                            className={commonBtnClass(config.filter === 'lowpass_fft', 'bg-indigo-600')}
                        >
                            Passe-bas Idéal
                        </button>
                        <button 
                            onClick={() => setConfig({...config, filter: config.filter === 'highpass_fft' ? 'none' : 'highpass_fft'})} 
                            className={commonBtnClass(config.filter === 'highpass_fft', 'bg-purple-600')}
                        >
                            Passe-haut Idéal
                        </button>
                    </div>
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                        <p className="text-[9px] text-slate-400 font-mono leading-tight">
                            Le filtrage fréquentiel permet de supprimer des bruits périodiques ou de lisser l'image en manipulant le domaine complexe.
                        </p>
                    </div>
                </div>
           </section>
        )}

        {activeModule === 'contours' && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Scissors size={12} className="text-orange-500" /> Détection de contours
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {['sobel', 'prewitt', 'robert', 'laplacian', 'gradient', 'isotropic', 'hough'].map(m => (
                        <button key={m} onClick={() => setConfig({...config, method: config.method === m ? 'none' : m})} className={`${commonBtnClass(config.method === m, 'bg-orange-600')} capitalize`}>{m}</button>
                    ))}
                </div>
            </div>
          </section>
        )}

        {activeModule === 'segmentation' && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Segmentation</h4>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Seuillage manuel</label>
                            <span className="text-green-400 font-mono text-xs">{config.threshold}</span>
                        </div>
                        <input type="range" min="0" max="255" value={config.threshold} onChange={(e) => setConfig({...config, threshold: parseInt(e.target.value)})} className="w-full accent-green-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => setConfig({...config, method: config.method === 'otsu' ? 'none' : 'otsu'})} className={commonBtnClass(config.method === 'otsu', 'bg-green-600')}>Otsu (Automatique)</button>
                    </div>
                </div>
            </div>
          </section>
        )}

        {activeModule === 'binary' && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Images binaires</h4>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setConfig({...config, operation: config.operation === 'erode' ? 'none' : 'erode'})} className={commonBtnClass(config.operation === 'erode', 'bg-teal-600')}>Érosion</button>
                    <button onClick={() => setConfig({...config, operation: config.operation === 'dilate' ? 'none' : 'dilate'})} className={commonBtnClass(config.operation === 'dilate', 'bg-cyan-600')}>Dilatation</button>
                    <button onClick={() => setConfig({...config, operation: config.operation === 'open' ? 'none' : 'open'})} className={commonBtnClass(config.operation === 'open', 'bg-sky-600')}>Ouverture</button>
                    <button onClick={() => setConfig({...config, operation: config.operation === 'close' ? 'none' : 'close'})} className={commonBtnClass(config.operation === 'close', 'bg-blue-600')}>Fermeture</button>
                    <button onClick={() => setConfig({...config, operation: config.operation === 'gradient_in' ? 'none' : 'gradient_in'})} className={commonBtnClass(config.operation === 'gradient_in', 'bg-indigo-600')}>G. Interne</button>
                    <button onClick={() => setConfig({...config, operation: config.operation === 'gradient_out' ? 'none' : 'gradient_out'})} className={commonBtnClass(config.operation === 'gradient_out', 'bg-purple-600')}>G. Externe</button>
                </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Waveform({ size, className }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M2 10v4" /><path d="M6 6v12" /><path d="M10 3v18" /><path d="M14 8v8" /><path d="M18 5v14" /><path d="M22 10v4" />
        </svg>
    );
}
