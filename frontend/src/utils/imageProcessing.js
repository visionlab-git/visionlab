/**
 * Advanced Image Processing Library
 * Implements Chapter 1 - Basic Processing
 */

export const getHistogram = (imageData) => {
  const data = imageData.data;
  const histogram = {
    r: new Array(256).fill(0),
    g: new Array(256).fill(0),
    b: new Array(256).fill(0),
    gray: new Array(256).fill(0),
  };

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = Math.round(0.2989 * r + 0.587 * g + 0.114 * b);

    histogram.r[r]++;
    histogram.g[g]++;
    histogram.b[b]++;
    histogram.gray[gray]++;
  }

  return histogram;
};

export const applyBasicTransform = (imageData, config) => {
  const data = imageData.data;
  const { brightness, contrast, grayscale, invert, threshold } = config;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    if (grayscale) {
      const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
      r = g = b = gray;
    }

    if (invert) {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    }

    if (brightness !== 0) {
      r += brightness;
      g += brightness;
      b += brightness;
    }

    if (contrast !== 0) {
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      r = factor * (r - 128) + 128;
      g = factor * (g - 128) + 128;
      b = factor * (b - 128) + 128;
    }

    if (threshold < 255 && threshold > 0) {
      const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
      const val = gray >= threshold ? 255 : 0;
      r = g = b = val;
    }

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
};

// Chapter 1 Functions
export const histogramEqualization = (imageData) => {
  const data = imageData.data;
  const hist = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += 4) {
    hist[Math.round(0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])]++;
  }

  const cdf = new Array(256).fill(0);
  cdf[0] = hist[0];
  for (let i = 1; i < 256; i++) {
    cdf[i] = cdf[i - 1] + hist[i];
  }

  const cdfMin = cdf.find(val => val > 0);
  const totalPixels = data.length / 4;
  const lut = new Array(256).fill(0);
  for (let i = 0; i < 256; i++) {
    lut[i] = Math.round(((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * 255);
  }

  for (let i = 0; i < data.length; i += 4) {
    data[i] = lut[data[i]];
    data[i + 1] = lut[data[i+1]];
    data[i + 2] = lut[data[i+2]];
  }
};

export const linearTransformWithSaturation = (imageData, sMin, sMax) => {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            let val = data[i + j];
            if (val <= sMin) val = 0;
            else if (val >= sMax) val = 255;
            else val = (val - sMin) * 255 / (sMax - sMin);
            data[i + j] = val;
        }
    }
};

export const applyGammaCorrection = (imageData, gamma) => {
    const data = imageData.data;
    const lut = new Array(256).fill(0).map((_, i) => Math.pow(i / 255, gamma) * 255);
    for (let i = 0; i < data.length; i += 4) {
        data[i] = lut[data[i]];
        data[i + 1] = lut[data[i+1]];
        data[i + 2] = lut[data[i+2]];
    }
};

// Interpolation
export const resizeNearestNeighbor = (srcData, width, height, newWidth, newHeight) => {
    const dstData = new Uint8ClampedArray(newWidth * newHeight * 4);
    const xRatio = width / newWidth;
    const yRatio = height / newHeight;

    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            const px = Math.floor(x * xRatio);
            const py = Math.floor(y * yRatio);
            const srcIdx = (py * width + px) * 4;
            const dstIdx = (y * newWidth + x) * 4;
            
            for (let c = 0; c < 4; c++) {
                dstData[dstIdx + c] = srcData[srcIdx + c];
            }
        }
    }
    return dstData;
};

export const resizeBilinear = (srcData, width, height, newWidth, newHeight) => {
    const dstData = new Uint8ClampedArray(newWidth * newHeight * 4);
    const xRatio = (width > 1) ? (width - 1) / (newWidth > 1 ? newWidth - 1 : 1) : 1;
    const yRatio = (height > 1) ? (height - 1) / (newHeight > 1 ? newHeight - 1 : 1) : 1;

    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            const xL = Math.floor(x * xRatio);
            const yL = Math.floor(y * yRatio);
            const xH = Math.min(width - 1, Math.ceil(x * xRatio));
            const yH = Math.min(height - 1, Math.ceil(y * yRatio));

            const xWeight = (x * xRatio) - xL;
            const yWeight = (y * yRatio) - yL;

            const dstIdx = (y * newWidth + x) * 4;

            for (let c = 0; c < 4; c++) {
                const a = srcData[(yL * width + xL) * 4 + c];
                const b = srcData[(yL * width + xH) * 4 + c];
                const d = srcData[(yH * width + xL) * 4 + c];
                const e = srcData[(yH * width + xH) * 4 + c];

                const val = a * (1 - xWeight) * (1 - yWeight) +
                            b * xWeight * (1 - yWeight) +
                            d * yWeight * (1 - xWeight) +
                            e * xWeight * yWeight;
                dstData[dstIdx + c] = val;
            }
        }
    }
    return dstData;
};
export const cropImage = (srcData, width, height, x, y, cropW, cropH) => {
    const dstData = new Uint8ClampedArray(cropW * cropH * 4);
    for (let dy = 0; dy < cropH; dy++) {
        for (let dx = 0; dx < cropW; dx++) {
            const sx = x + dx;
            const sy = y + dy;
            if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
                const srcIdx = (sy * width + sx) * 4;
                const dstIdx = (dy * cropW + dx) * 4;
                dstData[dstIdx] = srcData[srcIdx];
                dstData[dstIdx + 1] = srcData[srcIdx + 1];
                dstData[dstIdx + 2] = srcData[srcIdx + 2];
                dstData[dstIdx + 3] = srcData[srcIdx + 3];
            }
        }
    }
    return dstData;
};

// Bicubic Interpolation helper
const cubicInterpolate = (p, x) => {
    return p[1] + 0.5 * x * (p[2] - p[0] + x * (2.0 * p[0] - 5.0 * p[1] + 4.0 * p[2] - p[3] + x * (3.0 * (p[1] - p[2]) + p[3] - p[0])));
};

export const resizeBicubic = (srcData, width, height, newWidth, newHeight) => {
    const dstData = new Uint8ClampedArray(newWidth * newHeight * 4);
    const xRatio = width / newWidth;
    const yRatio = height / newHeight;

    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            const px = x * xRatio;
            const py = y * yRatio;
            const xInt = Math.floor(px);
            const yInt = Math.floor(py);
            const xFract = px - xInt;
            const yFract = py - yInt;

            const dstIdx = (y * newWidth + x) * 4;

            for (let c = 0; c < 4; c++) {
                const p = new Array(4);
                const jRows = new Array(4);
                
                for (let j = -1; j < 3; j++) {
                    const rowIdx = Math.max(0, Math.min(height - 1, yInt + j));
                    const pRow = new Array(4);
                    for (let i = -1; i < 3; i++) {
                        const colIdx = Math.max(0, Math.min(width - 1, xInt + i));
                        pRow[i + 1] = srcData[(rowIdx * width + colIdx) * 4 + c];
                    }
                    jRows[j + 1] = cubicInterpolate(pRow, xFract);
                }
                dstData[dstIdx + c] = Math.max(0, Math.min(255, cubicInterpolate(jRows, yFract)));
            }
        }
    }
    return dstData;
};

// Sharpening pass for "Super Resolution" feel
export const sharpen = (data, width, height) => {
    const original = new Uint8ClampedArray(data);
    const kernel = [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ];
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 3; c++) {
                let res = 0;
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                        res += original[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
                    }
                }
                data[(y * width + x) * 4 + c] = Math.max(0, Math.min(255, res));
            }
        }
    }
    return data;
};

// Arithmetic Operations
export const imageArithmetic = (data1, data2, operation) => {
    const result = new Uint8ClampedArray(data1.length);
    for (let i = 0; i < data1.length; i += 4) {
        const j = i % data2.length;
        for (let c = 0; c < 3; c++) {
            const v1 = data1[i + c];
            const v2 = data2[j + c];
            let res = 0;
            if (operation === 'add') res = v1 + v2;
            else if (operation === 'sub') res = v1 - v2;
            else if (operation === 'mult') res = (v1 * v2) / 255;
            result[i + c] = Math.max(0, Math.min(255, res));
        }
        result[i + 3] = data1[i + 3];
    }
    return result;
};

// Pixel Matrix extraction
export const getPixelMatrix = (imageData, startX, startY, size) => {
    const { width, height, data } = imageData;
    const matrix = [];
    for (let y = startY; y < Math.min(startY + size, height); y++) {
        const row = [];
        for (let x = startX; x < Math.min(startX + size, width); x++) {
            const i = (y * width + x) * 4;
            row.push([data[i], data[i+1], data[i+2]]);
        }
        matrix.push(row);
    }
    return matrix;
};
