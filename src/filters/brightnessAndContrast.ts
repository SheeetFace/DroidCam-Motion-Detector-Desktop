import cv from '@techstark/opencv-js';
import type { Mat } from '@techstark/opencv-js';

export function brightnessAndContrast(frame:Mat, brightness:number, contrast:number, excludeHeight:number): Mat {
    if(brightness === 0 && contrast === 0) return frame;

    const roi = frame.roi(new cv.Rect(0, excludeHeight, frame.cols, frame.rows - excludeHeight));
    
    const contrastFactor = contrast !== 0 ? 1 + (contrast / 100) : 1;
    roi.convertTo(roi, -1, contrastFactor, brightness);

    if(brightness < 0){
        const gamma = 1.0 + (-brightness / 100);
        const gammaLUT = new cv.Mat(1, 256, cv.CV_8U);
        for (let i = 0; i < 256; i++) {
            gammaLUT.data[i] = Math.pow(i / 255.0, gamma) * 255.0;
        }
        cv.LUT(roi, gammaLUT, roi);
        gammaLUT.delete();
    }

    return frame;
}