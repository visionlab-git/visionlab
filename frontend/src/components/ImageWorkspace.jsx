import React, { useRef, useEffect, useState } from 'react';
import { Download, Image as ImageIcon, Split, Square, Layers as LayersIcon } from 'lucide-react';
import { 
    applyBasicTransform, 
    histogramEqualization, 
    imageArithmetic, 
    resizeNearestNeighbor, 
    resizeBilinear,
    getPixelMatrix
} from '../utils/imageProcessing';
import { convolve, kernels, otsuThreshold, erode, dilate, opening, closing, internalGradient, externalGradient, detectEdges, applyFFTFilter, houghTransform } from '../utils/imageAlgorithms';
import ComparisonSlider from './ComparisonSlider';
import PixelMatrix from './PixelMatrix';

export default function ImageWorkspace({ originalImageObj, secondImageObj, config, onResetImage }) {
  const canvasRef = useRef(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixelMatrixData, setPixelMatrixData] = useState(null);

  useEffect(() => {
    if (originalImageObj && canvasRef.current) {
      applyAllFilters();
    }
  }, [originalImageObj, secondImageObj, config]);

  const applyAllFilters = async () => {
    setIsProcessing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    const maxWidth = window.innerWidth < 1024 ? (window.innerWidth < 768 ? window.innerWidth - 64 : 600) : 800;
    const maxHeight = 500;
    let width = originalImageObj.width;
    let height = originalImageObj.height;
    
    const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
    width = Math.floor(width * ratio);
    height = Math.floor(height * ratio);
    
    canvas.width = width;
    canvas.height = height;
    setCanvasSize({ width, height });
    
    ctx.drawImage(originalImageObj, 0, 0, width, height);
    let imageData = ctx.getImageData(0, 0, width, height);
    
    // 1. Interpolation (Chapter 1)
    if (config.interpolation !== 'none') {
        // To show interpolation effect without changing canvas size, 
        // we simulate a downscale-upscale cycle
        const tempWidth = Math.floor(width / 2);
        const tempHeight = Math.floor(height / 2);
        
        const downscaled = config.interpolation === 'nearest'
            ? resizeNearestNeighbor(imageData.data, width, height, tempWidth, tempHeight)
            : resizeBilinear(imageData.data, width, height, tempWidth, tempHeight);
            
        const upscaled = config.interpolation === 'nearest'
            ? resizeNearestNeighbor(downscaled, tempWidth, tempHeight, width, height)
            : resizeBilinear(downscaled, tempWidth, tempHeight, width, height);
            
        imageData = new ImageData(upscaled, width, height);
    }

    // 2. Arithmetic (Chapter 1)
    if (config.arithmetic !== 'none' && secondImageObj) {
        // Prepare second image data (resized to match)
        const sCanvas = document.createElement('canvas');
        sCanvas.width = width;
        sCanvas.height = height;
        const sCtx = sCanvas.getContext('2d');
        sCtx.drawImage(secondImageObj, 0, 0, width, height);
        const secondData = sCtx.getImageData(0, 0, width, height);
        
        const resData = imageArithmetic(imageData.data, secondData.data, config.arithmetic);
        imageData = new ImageData(resData, width, height);
    }

    // 3. Basic Transforms
    if (config.equalize) histogramEqualization(imageData);
    applyBasicTransform(imageData, config);

    // 4. Convolution (Chapter 2)
    if (config.filter !== 'none') {
        if (config.filter === 'mean' || config.filter === 'lowpass_std') imageData = convolve(imageData, kernels.mean);
        else if (config.filter === 'gaussian') imageData = convolve(imageData, kernels.gaussian);
        else if (config.filter === 'highpass') imageData = convolve(imageData, kernels.highPass);
        else if (['lowpass_fft', 'highpass_fft', 'spectrum'].includes(config.filter)) {
            imageData = applyFFTFilter(imageData, config.filter);
        }
    }

    // 5. Contours (Chapter 4)
    if (config.method !== 'none') {
        if (['sobel', 'prewitt', 'robert', 'laplacian', 'gradient', 'isotropic'].includes(config.method)) {
            imageData = detectEdges(imageData, config.method);
        } else if (config.method === 'hough') {
            imageData = houghTransform(imageData);
        }
    }

    // 6. Segmentation (Chapter 5)
    if (config.method === 'otsu') imageData = otsuThreshold(imageData);
    else if (config.threshold > 0) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            const val = gray >= config.threshold ? 255 : 0;
            data[i] = data[i+1] = data[i+2] = val;
        }
    }

    // 7. Binary (Chapter 6)
    if (config.operation === 'erode') imageData = erode(imageData);
    else if (config.operation === 'dilate') imageData = dilate(imageData);
    else if (config.operation === 'open') imageData = opening(imageData);
    else if (config.operation === 'close') imageData = closing(imageData);
    else if (config.operation === 'gradient_in') imageData = internalGradient(imageData);
    else if (config.operation === 'gradient_out') imageData = externalGradient(imageData);
    
    ctx.putImageData(imageData, 0, 0);
    setProcessedUrl(canvas.toDataURL());
    
    // Matrix extraction (center 8x8)
    if (config.showMatrix) {
        setPixelMatrixData(getPixelMatrix(imageData, Math.floor(width/2)-4, Math.floor(height/2)-4, 8));
    } else {
        setPixelMatrixData(null);
    }
    
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (processedUrl) {
      const link = document.createElement('a');
      link.download = 'visionlab-export.png';
      link.href = processedUrl;
      link.click();
    }
  };

  return (
    <div className="flex-1 glass-panel rounded-2xl p-4 md:p-8 flex flex-col relative overflow-hidden h-full border border-slate-800/50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 z-20 gap-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                <LayersIcon size={18} />
            </div>
            <div>
                <h2 className="text-base font-bold text-white tracking-tight">Studio Pro</h2>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Image & Math</p>
            </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setIsComparing(!isComparing)} 
            className={`flex-1 sm:flex-none px-4 py-2 text-[10px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 border uppercase tracking-wider ${
                isComparing ? 'bg-blue-600 text-white border-transparent shadow-lg' : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {isComparing ? <Square size={14} /> : <Split size={14} />}
            <span className="hidden xs:inline">{isComparing ? 'Standard' : 'Comparer'}</span>
          </button>
          
          <button onClick={onResetImage} className="flex-1 sm:flex-none px-4 py-2 text-[10px] font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 uppercase tracking-wider">Fermer</button>
          
          <button onClick={handleDownload} className="flex-1 sm:flex-none px-4 py-2 text-[10px] font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider">
            <Download size={14} /> <span className="hidden xs:inline">Exporter</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-slate-950/40 rounded-xl border border-slate-800/50 flex flex-col items-center justify-center overflow-auto relative z-10 p-4 shadow-inner min-h-[300px]">
          {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] z-30 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
          )}

          <div className="max-w-full max-h-full flex flex-col items-center gap-6">
              {isComparing ? (
                  <ComparisonSlider original={originalImageObj.src} current={processedUrl} width={canvasSize.width} height={canvasSize.height} />
              ) : (
                  <canvas ref={canvasRef} style={{ width: canvasSize.width, height: canvasSize.height }} className="object-contain shadow-2xl rounded-lg border border-slate-800"></canvas>
              )}

              {config.showMatrix && pixelMatrixData && (
                  <div className="w-full max-w-lg mt-4 animate-in fade-in zoom-in duration-300">
                      <PixelMatrix matrix={pixelMatrixData} />
                  </div>
              )}
          </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] px-2">
          <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Processeur Actif
          </div>
          <div>{originalImageObj.width} × {originalImageObj.height} PX</div>
      </div>
    </div>
  );
}
