import React, { useRef, useEffect, useState } from 'react';
import { Download, Image as ImageIcon, Split, Square, Layers as LayersIcon } from 'lucide-react';
import { 
    applyBasicTransform, 
    histogramEqualization, 
    imageArithmetic, 
    resizeNearestNeighbor, 
    resizeBilinear,
    resizeBicubic,
    cropImage,
    sharpen,
    getPixelMatrix
} from '../utils/imageProcessing';
import { convolve, kernels, otsuThreshold, erode, dilate, opening, closing, internalGradient, externalGradient, detectEdges, applyFFTFilter, houghTransform } from '../utils/imageAlgorithms';
import ComparisonSlider from './ComparisonSlider';
import PixelMatrix from './PixelMatrix';

export default function ImageWorkspace({ originalImageObj, secondImageObj, config, setConfig, onResetImage }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixelMatrixData, setPixelMatrixData] = useState(null);
  
  // Interactive Crop State
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null); // 'move' or 'resize'
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [tempCrop, setTempCrop] = useState(null);

  useEffect(() => {
    if (originalImageObj && canvasRef.current) {
      applyAllFilters();
    }
  }, [originalImageObj, secondImageObj, config]);

  // Sync temp crop with config when not dragging
  useEffect(() => {
    if (!isDragging) {
        setTempCrop(config.crop);
    }
  }, [config.crop, isDragging]);


  const applyAllFilters = async () => {
    setIsProcessing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Adaptive sizing for preview
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    const maxWidth = isMobile ? window.innerWidth - 48 : (isTablet ? 600 : 900);
    const maxHeight = isMobile ? 350 : 600;

    let width = originalImageObj.width;
    let height = originalImageObj.height;
    
    // 0. Super Resolution (Upscale) - This changes target dimensions
    let upscaleWidth = width;
    if (config.upscale !== 'none') {
        if (config.upscale === '700') upscaleWidth = 700;
        else if (config.upscale === '1024') upscaleWidth = 1024;
        else if (config.upscale === '2k') upscaleWidth = 2048;
        else if (config.upscale === '5k') upscaleWidth = 5120;
        else if (config.upscale === '10k') upscaleWidth = 10240;
        
        const scaleFactor = upscaleWidth / width;
        width = upscaleWidth;
        height = Math.floor(height * scaleFactor);
    }
    
    // 0.1 Recadrage (Crop) - This changes target dimensions
    let cropX = 0, cropY = 0, cropW = width, cropH = height;
    if (config.crop.active) {
        cropX = Math.floor((config.crop.x / 100) * width);
        cropY = Math.floor((config.crop.y / 100) * height);
        cropW = Math.floor((config.crop.width / 100) * width);
        cropH = Math.floor((config.crop.height / 100) * height);
        
        // Ensure within bounds
        cropW = Math.min(cropW, width - cropX);
        cropH = Math.min(cropH, height - cropY);
        
        width = cropW;
        height = cropH;
    }

    // Set canvas to target dimensions (even if preview is scaled down by CSS)
    canvas.width = width;
    canvas.height = height;
    
    // For preview visualization, we use adaptive ratio
    const previewRatio = Math.min(maxWidth / width, maxHeight / height, 1);
    const previewW = Math.floor(width * previewRatio);
    const previewH = Math.floor(height * previewRatio);
    setCanvasSize({ width: previewW, height: previewH });
    
    // Background canvas for processing at full target resolution
    const pCanvas = document.createElement('canvas');
    pCanvas.width = originalImageObj.width;
    pCanvas.height = originalImageObj.height;
    const pCtx = pCanvas.getContext('2d');
    pCtx.drawImage(originalImageObj, 0, 0);
    let imageData = pCtx.getImageData(0, 0, pCanvas.width, pCanvas.height);

    // 0. APPLY UPSCALE (Full Res)
    if (config.upscale !== 'none') {
        const targetW = upscaleWidth;
        const targetH = Math.floor((originalImageObj.height / originalImageObj.width) * targetW);
        const upscaledData = resizeBicubic(imageData.data, imageData.width, imageData.height, targetW, targetH);
        imageData = new ImageData(upscaledData, targetW, targetH);
        // Add sharpening for "clearer" feel
        imageData.data.set(sharpen(imageData.data, targetW, targetH));
    }

    // 0. APPLY CROP (Full Res)
    if (config.crop.active) {
        const targetW = Math.floor((config.crop.width / 100) * imageData.width);
        const targetH = Math.floor((config.crop.height / 100) * imageData.height);
        const targetX = Math.floor((config.crop.x / 100) * imageData.width);
        const targetY = Math.floor((config.crop.y / 100) * imageData.height);
        
        const croppedData = cropImage(imageData.data, imageData.width, imageData.height, targetX, targetY, targetW, targetH);
        imageData = new ImageData(croppedData, targetW, targetH);
    }
    
    // 1. Interpolation (Chapter 1)
    if (config.interpolation !== 'none') {
        const tempWidth = Math.floor(imageData.width / 2);
        const tempHeight = Math.floor(imageData.height / 2);
        
        const downscaled = config.interpolation === 'nearest'
            ? resizeNearestNeighbor(imageData.data, imageData.width, imageData.height, tempWidth, tempHeight)
            : (config.interpolation === 'bilinear' 
                ? resizeBilinear(imageData.data, imageData.width, imageData.height, tempWidth, tempHeight)
                : resizeBicubic(imageData.data, imageData.width, imageData.height, tempWidth, tempHeight));
            
        const upscaled = config.interpolation === 'nearest'
            ? resizeNearestNeighbor(downscaled, tempWidth, tempHeight, imageData.width, imageData.height)
            : (config.interpolation === 'bilinear'
                ? resizeBilinear(downscaled, tempWidth, tempHeight, imageData.width, imageData.height)
                : resizeBicubic(downscaled, tempWidth, tempHeight, imageData.width, imageData.height));
            
        imageData = new ImageData(upscaled, imageData.width, imageData.height);
    }

    // 2. Arithmetic (Chapter 1)
    if (config.arithmetic !== 'none' && secondImageObj) {
        const sCanvas = document.createElement('canvas');
        sCanvas.width = imageData.width;
        sCanvas.height = imageData.height;
        const sCtx = sCanvas.getContext('2d');
        sCtx.drawImage(secondImageObj, 0, 0, imageData.width, imageData.height);
        const secondData = sCtx.getImageData(0, 0, imageData.width, imageData.height);
        
        const resData = imageArithmetic(imageData.data, secondData.data, config.arithmetic);
        imageData = new ImageData(resData, imageData.width, imageData.height);
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
        setPixelMatrixData(getPixelMatrix(imageData, Math.floor(imageData.width/2)-4, Math.floor(imageData.height/2)-4, 8));
    } else {
        setPixelMatrixData(null);
    }
    
    setIsProcessing(false);
  };

  const handleInteractionStart = (e, mode) => {
    if (!config.crop.active) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    setDragMode(mode);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleInteractionMove = (e) => {
    if (!isDragging || !tempCrop) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const dx = ((clientX - startPos.x) / canvasSize.width) * 100;
    const dy = ((clientY - startPos.y) / canvasSize.height) * 100;

    let newCrop = { ...tempCrop };

    if (dragMode === 'move') {
        newCrop.x = Math.max(0, Math.min(100 - newCrop.width, tempCrop.x + dx));
        newCrop.y = Math.max(0, Math.min(100 - newCrop.height, tempCrop.y + dy));
    } else if (dragMode === 'resize') {
        newCrop.width = Math.max(10, Math.min(100 - newCrop.x, tempCrop.width + dx));
        newCrop.height = Math.max(10, Math.min(100 - newCrop.y, tempCrop.height + dy));
    }

    setTempCrop(newCrop);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleInteractionEnd = () => {
    if (isDragging && tempCrop) {
        setConfig(prev => ({ ...prev, crop: tempCrop }));
    }
    setIsDragging(false);
    setDragMode(null);
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
      
      <div className="flex-1 bg-slate-950/40 rounded-xl border border-slate-800/50 flex flex-col items-center justify-center overflow-auto relative z-10 p-2 md:p-6 shadow-inner min-h-[300px] max-h-[65vh]">
          {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md z-30 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse">Calcul Haute Résolution...</span>
                  </div>
              </div>
          )}

          <div 
            className="w-full h-full flex flex-col items-center justify-center gap-6"
            onMouseMove={handleInteractionMove}
            onMouseUp={handleInteractionEnd}
            onMouseLeave={handleInteractionEnd}
            onTouchMove={handleInteractionMove}
            onTouchEnd={handleInteractionEnd}
          >
              {isComparing ? (
                  <ComparisonSlider original={originalImageObj.src} current={processedUrl} width={canvasSize.width} height={canvasSize.height} />
              ) : (
                  <div className="relative group/canvas select-none" ref={containerRef}>
                    <canvas 
                        ref={canvasRef} 
                        style={{ width: canvasSize.width, height: canvasSize.height }} 
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-lg border border-slate-800 transition-opacity"
                    ></canvas>
                    
                    {config.crop.active && tempCrop && (
                        <div 
                            className={`absolute border-2 border-red-500 bg-red-500/10 cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] z-20`}
                            style={{
                                left: `${tempCrop.x}%`,
                                top: `${tempCrop.y}%`,
                                width: `${tempCrop.width}%`,
                                height: `${tempCrop.height}%`
                            }}
                            onMouseDown={(e) => handleInteractionStart(e, 'move')}
                            onTouchStart={(e) => handleInteractionStart(e, 'move')}
                        >
                            {/* Label */}
                            <div className="absolute -top-6 left-0 bg-red-600 text-[8px] font-black text-white px-2 py-0.5 rounded uppercase tracking-widest whitespace-nowrap">
                                Zone Interactive
                            </div>

                            {/* Resize Handle (Bottom-Right) */}
                            <div 
                                className="absolute -bottom-2 -right-2 w-6 h-6 bg-red-600 rounded-full border-4 border-white shadow-xl cursor-nwse-resize flex items-center justify-center z-30"
                                onMouseDown={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize'); }}
                                onTouchStart={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize'); }}
                            >
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-4 border-l-4 border-white"></div>
                            <div className="absolute top-0 right-0 w-3 h-3 border-t-4 border-r-4 border-white"></div>
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-4 border-l-4 border-white"></div>
                        </div>
                    )}
                  </div>
              )}

              {config.showMatrix && pixelMatrixData && (
                  <div className="w-full max-w-sm md:max-w-lg mt-4 animate-in fade-in zoom-in duration-300">
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
