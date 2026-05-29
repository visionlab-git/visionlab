/**
 * Advanced Image Processing Algorithms for Chapters 2-6
 */

// --- Chapter 2: Convolution ---
export const kernels = {
    mean: [
        1/9, 1/9, 1/9,
        1/9, 1/9, 1/9,
        1/9, 1/9, 1/9
    ],
    gaussian: [
        1/16, 2/16, 1/16,
        2/16, 4/16, 2/16,
        1/16, 2/16, 1/16
    ],
    highPass: [
        -1, -1, -1,
        -1,  8, -1,
        -1, -1, -1
    ],
    sobelX: [
        -1, 0, 1,
        -2, 0, 2,
        -1, 0, 1
    ],
    sobelY: [
        -1, -2, -1,
         0,  0,  0,
         1,  2,  1
    ],
    prewittX: [
        -1, 0, 1,
        -1, 0, 1,
        -1, 0, 1
    ],
    prewittY: [
        -1, -1, -1,
         0,  0,  0,
         1,  1,  1
    ],
    robertsX: [
        1, 0,
        0, -1
    ],
    robertsY: [
        0, 1,
        -1, 0
    ],
    laplacian: [
        0,  1, 0,
        1, -4, 1,
        0,  1, 0
    ],
    isotropicX: [
        -1, 0, 1,
        -Math.sqrt(2), 0, Math.sqrt(2),
        -1, 0, 1
    ],
    isotropicY: [
        -1, -Math.sqrt(2), -1,
         0, 0, 0,
         1, Math.sqrt(2), 1
    ]
};

export const convolve = (imageData, kernel) => {
    const { width, height, data } = imageData;
    const side = Math.sqrt(kernel.length);
    const halfSide = Math.floor(side / 2);
    const output = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0;
            for (let ky = 0; ky < side; ky++) {
                for (let kx = 0; kx < side; kx++) {
                    const py = Math.min(height - 1, Math.max(0, y + ky - halfSide));
                    const px = Math.min(width - 1, Math.max(0, x + kx - halfSide));
                    const idx = (py * width + px) * 4;
                    const weight = kernel[ky * side + kx];
                    r += data[idx] * weight;
                    g += data[idx + 1] * weight;
                    b += data[idx + 2] * weight;
                }
            }
            const i = (y * width + x) * 4;
            output[i] = r;
            output[i + 1] = g;
            output[i + 2] = b;
            output[i + 3] = data[i + 3];
        }
    }
    return new ImageData(output, width, height);
};

// --- Chapter 3: Fourier Transform ---

// 1D FFT implementation
const fft1D = (re, im, invert) => {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) {
        let bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) {
            [re[i], re[j]] = [re[j], re[i]];
            [im[i], im[j]] = [im[j], im[i]];
        }
    }

    for (let len = 2; len <= n; len <<= 1) {
        let ang = 2 * Math.PI / len * (invert ? -1 : 1);
        let wlenRe = Math.cos(ang);
        let wlenIm = Math.sin(ang);
        for (let i = 0; i < n; i += len) {
            let wRe = 1;
            let wIm = 0;
            for (let j = 0; j < len / 2; j++) {
                let uRe = re[i + j], uIm = im[i + j];
                let vRe = re[i + j + len / 2] * wRe - im[i + j + len / 2] * wIm;
                let vIm = re[i + j + len / 2] * wIm + im[i + j + len / 2] * wRe;
                re[i + j] = uRe + vRe;
                im[i + j] = uIm + vIm;
                re[i + j + len / 2] = uRe - vRe;
                im[i + j + len / 2] = uIm - vIm;
                let nextWRe = wRe * wlenRe - wIm * wlenIm;
                wIm = wRe * wlenIm + wIm * wlenRe;
                wRe = nextWRe;
            }
        }
    }

    if (invert) {
        for (let i = 0; i < n; i++) {
            re[i] /= n;
            im[i] /= n;
        }
    }
};

const nextPow2 = (n) => {
    let p = 1;
    while (p < n) p <<= 1;
    return p;
};

export const applyFFTFilter = (imageData, type) => {
    const { width, height, data } = imageData;
    const n = nextPow2(Math.max(width, height));
    
    // Convert to grayscale for FFT
    const re = new Float32Array(n * n);
    const im = new Float32Array(n * n);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            re[y * n + x] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        }
    }

    // 2D FFT
    for (let i = 0; i < n; i++) {
        const rowRe = re.subarray(i * n, (i + 1) * n);
        const rowIm = im.subarray(i * n, (i + 1) * n);
        fft1D(rowRe, rowIm, false);
    }
    
    for (let j = 0; j < n; j++) {
        const colRe = new Float32Array(n);
        const colIm = new Float32Array(n);
        for (let i = 0; i < n; i++) {
            colRe[i] = re[i * n + j];
            colIm[i] = im[i * n + j];
        }
        fft1D(colRe, colIm, false);
        for (let i = 0; i < n; i++) {
            re[i * n + j] = colRe[i];
            im[i * n + j] = colIm[i];
        }
    }

    // Centered visualization (Spectrum)
    if (type === 'spectrum') {
        const spectrum = new Uint8ClampedArray(width * height * 4);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // FFT Shift
                const sy = (y + n/2) % n;
                const sx = (x + n/2) % n;
                const idx = sy * n + sx;
                const mag = Math.sqrt(re[idx]**2 + im[idx]**2);
                const val = Math.min(255, 20 * Math.log(1 + mag));
                const outIdx = (y * width + x) * 4;
                spectrum[outIdx] = spectrum[outIdx+1] = spectrum[outIdx+2] = val;
                spectrum[outIdx+3] = 255;
            }
        }
        return new ImageData(spectrum, width, height);
    }

    // Frequency filtering
    const cutoff = n / 10;
    for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
            const dy = y < n/2 ? y : y - n;
            const dx = x < n/2 ? x : x - n;
            const dist = Math.sqrt(dy*dy + dx*dx);
            
            let mask = 1;
            if (type === 'lowpass_fft') mask = dist < cutoff ? 1 : 0;
            else if (type === 'highpass_fft') mask = dist > cutoff ? 1 : 0;
            
            re[y * n + x] *= mask;
            im[y * n + x] *= mask;
        }
    }

    // Inverse 2D FFT
    for (let j = 0; j < n; j++) {
        const colRe = new Float32Array(n);
        const colIm = new Float32Array(n);
        for (let i = 0; i < n; i++) {
            colRe[i] = re[i * n + j];
            colIm[i] = im[i * n + j];
        }
        fft1D(colRe, colIm, true);
        for (let i = 0; i < n; i++) {
            re[i * n + j] = colRe[i];
            im[i * n + j] = colIm[i];
        }
    }
    
    for (let i = 0; i < n; i++) {
        const rowRe = re.subarray(i * n, (i + 1) * n);
        const rowIm = im.subarray(i * n, (i + 1) * n);
        fft1D(rowRe, rowIm, true);
    }

    const output = new Uint8ClampedArray(data.length);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const val = Math.max(0, Math.min(255, re[y * n + x]));
            output[i] = output[i + 1] = output[i + 2] = val;
            output[i + 3] = 255;
        }
    }
    return new ImageData(output, width, height);
};

// --- Chapter 4: Contours ---
export const detectEdges = (imageData, method) => {
    const { width, height, data } = imageData;
    const output = new Uint8ClampedArray(data.length);
    
    let gx, gy;
    
    if (method === 'sobel') {
        gx = convolve(imageData, kernels.sobelX);
        gy = convolve(imageData, kernels.sobelY);
    } else if (method === 'prewitt') {
        gx = convolve(imageData, kernels.prewittX);
        gy = convolve(imageData, kernels.prewittY);
    } else if (method === 'robert') {
        gx = convolve(imageData, kernels.robertsX);
        gy = convolve(imageData, kernels.robertsY);
    } else if (method === 'isotropic') {
        gx = convolve(imageData, kernels.isotropicX);
        gy = convolve(imageData, kernels.isotropicY);
    } else if (method === 'laplacian') {
        return convolve(imageData, kernels.laplacian);
    } else if (method === 'gradient') {
        // Robust gradient using simple masks [-1, 1]
        const gxK = [-1, 1];
        const gyK = [-1, 1];
        const result = new Uint8ClampedArray(data.length);
        for (let y = 0; y < height - 1; y++) {
            for (let x = 0; x < width - 1; x++) {
                const i = (y * width + x) * 4;
                const iX = (y * width + (x + 1)) * 4;
                const iY = ((y + 1) * width + x) * 4;
                for (let c = 0; c < 3; c++) {
                    const dx = data[iX + c] - data[i + c];
                    const dy = data[iY + c] - data[i + c];
                    result[i + c] = Math.sqrt(dx*dx + dy*dy) * 2; // scale for visibility
                }
                result[i + 3] = 255;
            }
        }
        return new ImageData(result, width, height);
    }

    if (gx && gy) {
        for (let i = 0; i < data.length; i += 4) {
            for (let c = 0; c < 3; c++) {
                output[i + c] = Math.sqrt(gx.data[i + c]**2 + gy.data[i + c]**2);
            }
            output[i + 3] = 255;
        }
        return new ImageData(output, width, height);
    }
    
    return imageData;
};

export const houghTransform = (imageData) => {
    // Simplified Hough Transform for line visualization
    const { width, height, data } = imageData;
    // 1. Edge detection (Sobel)
    const edges = detectEdges(imageData, 'sobel');
    const edgeData = edges.data;
    
    // 2. Accumulator setup
    const rhoMax = Math.sqrt(width * width + height * height);
    const nRho = Math.floor(rhoMax * 2);
    const nTheta = 180;
    const accumulator = new Int32Array(nRho * nTheta);
    
    // 3. Voting
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            if (edgeData[i] > 100) { // Threshold
                for (let theta = 0; theta < nTheta; theta++) {
                    const rad = (theta * Math.PI) / 180;
                    const rho = x * Math.cos(rad) + y * Math.sin(rad);
                    const rhoIdx = Math.floor(rho + rhoMax);
                    accumulator[rhoIdx * nTheta + theta]++;
                }
            }
        }
    }
    
    // 4. Visualization (Hough Space)
    const output = new Uint8ClampedArray(width * height * 4);
    let maxVote = 0;
    for (let i = 0; i < accumulator.length; i++) if (accumulator[i] > maxVote) maxVote = accumulator[i];
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            // Map accumulator space to image space for visualization
            const ax = Math.floor((x / width) * (nTheta - 1));
            const ay = Math.floor((y / height) * (nRho - 1));
            const val = (accumulator[ay * nTheta + ax] / maxVote) * 255 * 5; 
            output[i] = output[i+1] = output[i+2] = Math.min(255, val);
            output[i+3] = 255;
        }
    }
    return new ImageData(output, width, height);
};

// --- Chapter 5: Segmentation ---
export const otsuThreshold = (imageData) => {
    const { data, width, height } = imageData;
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) {
        const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        histogram[gray]++;
    }

    let total = width * height;
    let sum = 0;
    for (let t = 0; t < 256; t++) sum += t * histogram[t];

    let sumB = 0;
    let wB = 0;
    let wF = 0;
    let varMax = 0;
    let threshold = 0;

    for (let t = 0; t < 256; t++) {
        wB += histogram[t];
        if (wB === 0) continue;
        wF = total - wB;
        if (wF === 0) break;
        sumB += t * histogram[t];
        let mB = sumB / wB;
        let mF = (sum - sumB) / wF;
        let varBetween = wB * wF * (mB - mF) * (mB - mF);
        if (varBetween > varMax) {
            varMax = varBetween;
            threshold = t;
        }
    }

    const output = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const val = gray >= threshold ? 255 : 0;
        output[i] = output[i + 1] = output[i + 2] = val;
        output[i + 3] = 255;
    }
    return new ImageData(output, width, height);
};

// --- Chapter 6: Binary Operations (Morphology) ---
export const dilate = (imageData) => {
    const { width, height, data } = imageData;
    const output = new Uint8ClampedArray(data.length);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let maxR = 0, maxG = 0, maxB = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const py = Math.min(height - 1, Math.max(0, y + dy));
                    const px = Math.min(width - 1, Math.max(0, x + dx));
                    const idx = (py * width + px) * 4;
                    maxR = Math.max(maxR, data[idx]);
                    maxG = Math.max(maxG, data[idx + 1]);
                    maxB = Math.max(maxB, data[idx + 2]);
                }
            }
            const i = (y * width + x) * 4;
            output[i] = maxR;
            output[i + 1] = maxG;
            output[i + 2] = maxB;
            output[i + 3] = 255;
        }
    }
    return new ImageData(output, width, height);
};

export const erode = (imageData) => {
    const { width, height, data } = imageData;
    const output = new Uint8ClampedArray(data.length);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let minR = 255, minG = 255, minB = 255;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const py = Math.min(height - 1, Math.max(0, y + dy));
                    const px = Math.min(width - 1, Math.max(0, x + dx));
                    const idx = (py * width + px) * 4;
                    minR = Math.min(minR, data[idx]);
                    minG = Math.min(minG, data[idx + 1]);
                    minB = Math.min(minB, data[idx + 2]);
                }
            }
            const i = (y * width + x) * 4;
            output[i] = minR;
            output[i + 1] = minG;
            output[i + 2] = minB;
            output[i + 3] = 255;
        }
    }
    return new ImageData(output, width, height);
};

export const opening = (imageData) => {
    return dilate(erode(imageData));
};

export const closing = (imageData) => {
    return erode(dilate(imageData));
};

export const internalGradient = (imageData) => {
    const eroded = erode(imageData);
    const { data, width, height } = imageData;
    const output = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i += 4) {
        output[i] = Math.max(0, data[i] - eroded.data[i]);
        output[i+1] = Math.max(0, data[i+1] - eroded.data[i+1]);
        output[i+2] = Math.max(0, data[i+2] - eroded.data[i+2]);
        output[i+3] = 255;
    }
    return new ImageData(output, width, height);
};

export const externalGradient = (imageData) => {
    const dilated = dilate(imageData);
    const { data, width, height } = imageData;
    const output = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i += 4) {
        output[i] = Math.max(0, dilated.data[i] - data[i]);
        output[i+1] = Math.max(0, dilated.data[i+1] - data[i+1]);
        output[i+2] = Math.max(0, dilated.data[i+2] - data[i+2]);
        output[i+3] = 255;
    }
    return new ImageData(output, width, height);
};
