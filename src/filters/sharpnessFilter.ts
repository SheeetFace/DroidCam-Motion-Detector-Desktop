import cv from '@techstark/opencv-js';
import type { Mat } from '@techstark/opencv-js';

export function sharpnessFilter(frame:Mat, sharpness:number, excludeHeight:number): Mat {
    if(sharpness <= 0) return frame;

    const kernel = new cv.Mat(3, 3, cv.CV_32F, new cv.Scalar(0));
    kernel.floatPtr(1, 1)[0] = 1 + sharpness;  
    kernel.floatPtr(0, 1)[0] = -sharpness / 4; 
    kernel.floatPtr(2, 1)[0] = -sharpness / 4; 
    kernel.floatPtr(1, 0)[0] = -sharpness / 4; 
    kernel.floatPtr(1, 2)[0] = -sharpness / 4; 

    const roi = frame.roi(new cv.Rect(0, excludeHeight, frame.cols, frame.rows - excludeHeight));
    cv.filter2D(roi, roi, -1, kernel);

    kernel.delete();
    return frame;
}