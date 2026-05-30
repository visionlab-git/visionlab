import React, { useRef, useEffect, useState } from 'react';
import { Download, Image as ImageIcon, Split, Square, Layers as LayersIcon, Maximize2, Minimize2 } from 'lucide-react';
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

export default function ImageWorkspace({ originalImageObj, secondImageObj, config, setConfig, isZenMode, setIsZenMode, onResetImage }) {
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
    
    // Adaptive sizing for preview - maximized for professional editing
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    const maxWidth = isMobile ? window.innerWidth - 60 : (isTablet ? 800 : 1200);
    const maxHeight = isMobile ? window.innerHeight * 0.6 : 800;

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
        
        // Only apply dimensional change to the view if handles are hidden (validated)
        if (!config.crop.showHandles) {
            width = cropW;
            height = cropH;
        }
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
    // 0. APPLY CROP (Full Res) - Only if NOT in editing mode (handles hidden)
    if (config.crop.active && !config.crop.showHandles) {
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
    } else if (dragMode === 'resize-br' || dragMode === 'resize') {
        newCrop.width = Math.max(10, Math.min(100 - newCrop.x, tempCrop.width + dx));
        newCrop.height = Math.max(10, Math.min(100 - newCrop.y, tempCrop.height + dy));
    } else if (dragMode === 'resize-tl') {
        const newWidth = Math.max(10, tempCrop.width - dx);
        const newHeight = Math.max(10, tempCrop.height - dy);
        newCrop.x = Math.max(0, Math.min(tempCrop.x + tempCrop.width - 10, tempCrop.x + dx));
        newCrop.y = Math.max(0, Math.min(tempCrop.y + tempCrop.height - 10, tempCrop.y + dy));
        newCrop.width = tempCrop.width + (tempCrop.x - newCrop.x);
        newCrop.height = tempCrop.height + (tempCrop.y - newCrop.y);
    } else if (dragMode === 'resize-tr') {
        newCrop.y = Math.max(0, Math.min(tempCrop.y + tempCrop.height - 10, tempCrop.y + dy));
        newCrop.height = tempCrop.height + (tempCrop.y - newCrop.y);
        newCrop.width = Math.max(10, Math.min(100 - newCrop.x, tempCrop.width + dx));
    } else if (dragMode === 'resize-bl') {
        newCrop.x = Math.max(0, Math.min(tempCrop.x + tempCrop.width - 10, tempCrop.x + dx));
        newCrop.width = tempCrop.width + (tempCrop.x - newCrop.x);
        newCrop.height = Math.max(10, Math.min(100 - newCrop.y, tempCrop.height + dy));
    } else if (dragMode === 'resize-t') {
        newCrop.y = Math.max(0, Math.min(tempCrop.y + tempCrop.height - 10, tempCrop.y + dy));
        newCrop.height = tempCrop.height + (tempCrop.y - newCrop.y);
    } else if (dragMode === 'resize-b') {
        newCrop.height = Math.max(10, Math.min(100 - newCrop.y, tempCrop.height + dy));
    } else if (dragMode === 'resize-l') {
        newCrop.x = Math.max(0, Math.min(tempCrop.x + tempCrop.width - 10, tempCrop.x + dx));
        newCrop.width = tempCrop.width + (tempCrop.x - newCrop.x);
    } else if (dragMode === 'resize-r') {
        newCrop.width = Math.max(10, Math.min(100 - newCrop.x, tempCrop.width + dx));
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
    <div className="flex-none lg:flex-1 bg-slate-950/20 flex flex-col relative overflow-hidden h-[60vh] lg:h-full min-h-[400px] lg:min-h-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-5 mb-0 z-20 gap-3 sm:gap-4 bg-slate-950/40 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                <LayersIcon size={18} />
            </div>
            <div>
                <h2 className="text-base font-bold text-white tracking-tight">Studio Pro</h2>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Image & Math</span>
                    <span className="text-[9px] text-blue-500/40">•</span>
                    <div className="flex items-center gap-1.5 text-[8px] text-blue-400 font-black uppercase tracking-tighter">
                        <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></span>
                        {canvasSize.width} × {canvasSize.height} PX
                    </div>
                </div>
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

          <button 
            onClick={() => setIsZenMode(!isZenMode)}
            className={`flex-1 sm:flex-none px-4 py-2 text-[10px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 border uppercase tracking-wider ${
                isZenMode ? 'bg-amber-600 text-white border-transparent shadow-lg' : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title={isZenMode ? "Quitter le mode large" : "Mode Large (Zen)"}
          >
            {isZenMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span className="hidden xs:inline">{isZenMode ? 'Réduire' : 'Mode Large'}</span>
          </button>
          
          <button onClick={onResetImage} className="flex-1 sm:flex-none px-4 py-2 text-[10px] font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 uppercase tracking-wider">Fermer</button>
          
          <button onClick={handleDownload} className="flex-1 sm:flex-none px-4 py-2 text-[10px] font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider">
            <Download size={14} /> <span className="hidden xs:inline">Exporter</span>
          </button>
        </div>
      </div>
      
      <div className="flex-none sm:flex-1 bg-slate-950/60 flex flex-col items-center justify-center overflow-auto relative z-10 p-0 shadow-inner min-h-[400px] sm:min-h-0 h-[60vh] sm:h-full">
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
                  <div className="flex-1 w-full overflow-auto custom-scrollbar relative z-10 p-2" ref={containerRef}>
                    <div 
                        className="min-h-full min-w-full flex items-center justify-center p-8 md:p-12 pb-16 md:pb-24"
                        onMouseMove={handleInteractionMove}
                        onMouseUp={handleInteractionEnd}
                        onMouseLeave={handleInteractionEnd}
                        onTouchMove={handleInteractionMove}
                        onTouchEnd={handleInteractionEnd}
                    >
                        <div className="relative shadow-[0_30px_60px_-12px_rgba(0,0,0,0.6)] rounded-lg shrink-0" style={{ width: canvasSize.width, height: canvasSize.height }}>
                            <canvas 
                                ref={canvasRef} 
                                style={{ width: '100%', height: '100%' }} 
                                className="shadow-2xl rounded-lg border border-slate-800 transition-opacity"
                            ></canvas>
                        
                        {config.crop.active && config.crop.showHandles && tempCrop && (
                            <div 
                                className={`absolute border-2 border-red-500 bg-red-500/5 cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] z-20`}
                                style={{
                                    left: `${tempCrop.x}%`,
                                    top: `${tempCrop.y}%`,
                                    width: `${tempCrop.width}%`,
                                    height: `${tempCrop.height}%`
                                }}
                                onMouseDown={(e) => handleInteractionStart(e, 'move')}
                                onTouchStart={(e) => handleInteractionStart(e, 'move')}
                            >
                                {/* Terminer Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setConfig(prev => ({ ...prev, crop: { ...prev.crop, showHandles: false } }));
                                        }}
                                        className="pointer-events-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-lg shadow-2xl uppercase tracking-widest flex items-center gap-2 transform active:scale-95 transition-all"
                                    >
                                        Terminer
                                    </button>
                                </div>

                                {/* Label - Inside to avoid clipping */}
                                <div className="absolute top-2 left-2 flex flex-col gap-0.5 pointer-events-none">
                                    <div className="bg-red-600/80 backdrop-blur-sm text-[7px] font-black text-white px-2 py-0.5 rounded uppercase tracking-widest whitespace-nowrap inline-block">
                                        Zone Interactive
                                    </div>
                                    <div className="text-[7px] text-white font-bold uppercase tracking-tighter drop-shadow-md">
                                        {Math.floor(tempCrop.width)}% × {Math.floor(tempCrop.height)}%
                                    </div>
                                </div>

                                {/* Handles for all 4 corners for better visibility & interaction */}
                                {/* Top-Left */}
                                <div 
                                    className="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full border-2 border-red-500 shadow-xl cursor-nwse-resize z-30"
                                    onMouseDown={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-tl'); }}
                                    onTouchStart={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-tl'); }}
                                ></div>
                                
                                {/* Top-Right */}
                                <div 
                                    className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full border-2 border-red-500 shadow-xl cursor-nesw-resize z-30"
                                    onMouseDown={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-tr'); }}
                                    onTouchStart={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-tr'); }}
                                ></div>

                                {/* Bottom-Left */}
                                <div 
                                    className="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full border-2 border-red-500 shadow-xl cursor-nesw-resize z-30"
                                    onMouseDown={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-bl'); }}
                                    onTouchStart={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-bl'); }}
                                ></div>

                                {/* Bottom-Right (Main) */}
                                <div 
                                    className="absolute -bottom-4 -right-4 w-9 h-9 bg-red-600 rounded-full border-4 border-white shadow-2xl cursor-nwse-resize flex items-center justify-center z-30 transition-transform active:scale-90"
                                    onMouseDown={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-br'); }}
                                    onTouchStart={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-br'); }}
                                >
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                </div>

                                {/* Side Handles (Normal behavior) */}
                                {/* Top Edge */}
                                <div 
                                    className="absolute top-[-4px] left-[20%] right-[20%] h-[8px] cursor-ns-resize hover:bg-red-500/30 transition-colors z-20 rounded-full"
                                    onMouseDown={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-t'); }}
                                    onTouchStart={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-t'); }}
                                ></div>
                                {/* Bottom Edge */}
                                <div 
                                    className="absolute bottom-[-4px] left-[20%] right-[20%] h-[8px] cursor-ns-resize hover:bg-red-500/30 transition-colors z-20 rounded-full"
                                    onMouseDown={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-b'); }}
                                    onTouchStart={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-b'); }}
                                ></div>
                                {/* Left Edge */}
                                <div 
                                    className="absolute left-[-4px] top-[20%] bottom-[20%] w-[8px] cursor-ew-resize hover:bg-red-500/30 transition-colors z-20 rounded-full"
                                    onMouseDown={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-l'); }}
                                    onTouchStart={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-l'); }}
                                ></div>
                                {/* Right Edge */}
                                <div 
                                    className="absolute right-[-4px] top-[20%] bottom-[20%] w-[8px] cursor-ew-resize hover:bg-red-500/30 transition-colors z-20 rounded-full"
                                    onMouseDown={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-r'); }}
                                    onTouchStart={(e) => { e.stopPropagation(); handleInteractionStart(e, 'resize-r'); }}
                                ></div>
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              )}

              {config.showMatrix && pixelMatrixData && (
                  <div className="w-full max-w-sm md:max-w-lg mt-4 animate-in fade-in zoom-in duration-300">
                      <PixelMatrix matrix={pixelMatrixData} />
                  </div>
              )}
          </div>
      </div>

    </div>
  );
}
