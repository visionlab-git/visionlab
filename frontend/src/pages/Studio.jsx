import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import UploadZone from '../components/UploadZone';
import ImageWorkspace from '../components/ImageWorkspace';
import ControlPanel from '../components/ControlPanel';
import { getHistogram } from '../utils/imageProcessing';
import { Menu, X } from 'lucide-react';

export default function Studio({ onOpenSupport }) {
  const [image, setImage] = useState(null);
  const [originalImageObj, setOriginalImageObj] = useState(null);
  
  const [secondImage, setSecondImage] = useState(null);
  const [secondImageObj, setSecondImageObj] = useState(null);

  const [activeModule, setActiveModule] = useState('base');
  const [histogramData, setHistogramData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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
    crop: { active: false, x: 0, y: 0, width: 100, height: 100 }
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
      upscale: 'none', crop: { active: false, x: 0, y: 0, width: 100, height: 100 }
    });
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans relative">
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden absolute top-4 left-4 z-50 p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-xl"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
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

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden h-full w-full">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        {!image ? (
          <div className="w-full max-w-4xl px-4">
            <UploadZone onImageSelected={handleImageSelected} />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col lg:flex-row gap-4 md:gap-6 z-10 overflow-hidden pt-12 lg:pt-0">
            <ImageWorkspace 
              originalImageObj={originalImageObj} 
              secondImageObj={secondImageObj}
              config={config} 
              setConfig={setConfig}
              onResetImage={handleResetImage} 
            />

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
      </main>
    </div>
  );
}
