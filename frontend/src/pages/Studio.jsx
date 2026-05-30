import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import UploadZone from '../components/UploadZone';
import ImageWorkspace from '../components/ImageWorkspace';
import ControlPanel from '../components/ControlPanel';
import { getHistogram } from '../utils/imageProcessing';
import { Menu, X, HelpCircle } from 'lucide-react';

export default function Studio({ onOpenSupport }) {
  const [image, setImage] = useState(null);
  const [originalImageObj, setOriginalImageObj] = useState(null);

  const [secondImage, setSecondImage] = useState(null);
  const [secondImageObj, setSecondImageObj] = useState(null);

  const [activeModule, setActiveModule] = useState('base');
  const [histogramData, setHistogramData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  const [config, setConfig] = useState({
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
    showMatrix: false,
    upscale: 'none', // Resolution upscale: '700', '1024', '2k', '5k', '10k'
    crop: { active: false, x: 10, y: 10, width: 80, height: 80, showHandles: false }
  });

  const handleImageSelected = (dataUrl, imgObj) => {
    setImage(dataUrl);
    setOriginalImageObj(imgObj);

    const canvas = document.createElement('canvas');
    canvas.width = imgObj.width;
    canvas.height = imgObj.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgObj, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistogramData(getHistogram(imageData));
  };

  const handleSecondImageSelected = (dataUrl, imgObj) => {
    setSecondImage(dataUrl);
    setSecondImageObj(imgObj);
  };

  const handleResetImage = () => {
    setImage(null);
    setOriginalImageObj(null);
    setSecondImage(null);
    setSecondImageObj(null);
    setHistogramData(null);
    setConfig({
      brightness: 0, contrast: 0, grayscale: false, invert: false, threshold: 0,
      equalize: false, filter: 'none', method: 'none', operation: 'none',
      interpolation: 'none', arithmetic: 'none', showMatrix: false,
      upscale: 'none', crop: { active: false, x: 10, y: 10, width: 80, height: 80, showHandles: false }
    });
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans relative">
      {/* Mobile Top Bar */}
      <div className="lg:hidden absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-slate-800 rounded-lg border border-slate-700 shadow-lg text-slate-300"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="VisionLab" className="w-8 h-8 object-contain" />
            <span className="text-xs font-black uppercase tracking-widest text-white">Vision<span className="text-blue-500">Lab</span></span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onOpenSupport} className="p-2 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-500/20 shadow-lg">
            <HelpCircle size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Live Studio</span>
          </div>
        </div>
      </div>

      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : (isZenMode ? '-translate-x-full lg:absolute' : '-translate-x-full')
        } ${isZenMode ? 'lg:hidden' : ''}`}>
        <Sidebar
          activeModule={activeModule}
          setActiveModule={(m) => {
            setActiveModule(m);
            setIsSidebarOpen(false);
          }}
          onOpenSupport={onOpenSupport}
        />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className={`flex-1 flex flex-col relative overflow-hidden h-screen w-full ${!image ? 'items-center justify-center p-4 md:p-8' : 'p-0'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Background Gradients */}
        {!image ? (
          <div className="w-full max-w-4xl px-4 mt-16 lg:mt-0">
            <UploadZone onImageSelected={handleImageSelected} />
          </div>
        ) : (
          <div className="w-full h-full lg:h-full flex flex-col lg:flex-row gap-0 lg:gap-3 z-10 lg:overflow-hidden pt-16 lg:pt-0 no-scrollbar overflow-hidden">
            <div className="flex-none w-full h-[65vh] lg:h-full lg:flex-1 sticky top-0 z-30 lg:relative border-b border-slate-800 lg:border-none shadow-2xl">
              <ImageWorkspace 
                originalImageObj={originalImageObj} 
                secondImageObj={secondImageObj}
                config={config} 
                setConfig={setConfig}
                isZenMode={isZenMode}
                setIsZenMode={setIsZenMode}
                onResetImage={handleResetImage} 
              />
            </div>

            {!isZenMode && (
              <div className="flex-1 lg:flex-none w-full lg:w-auto h-[35vh] lg:h-full overflow-y-auto p-4 lg:p-0 bg-slate-950/90 backdrop-blur-md lg:bg-transparent -mt-6 lg:mt-0 rounded-t-[2.5rem] lg:rounded-none relative z-40 lg:z-10 shadow-[0_-15px_40px_rgba(0,0,0,0.5)] lg:shadow-none custom-scrollbar">
                <ControlPanel
                  activeModule={activeModule}
                  config={config}
                  setConfig={setConfig}
                  histogramData={histogramData}
                  onSecondImageUpload={handleSecondImageSelected}
                  hasSecondImage={!!secondImage}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
