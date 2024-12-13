import { LIMIT_WINDOWS_SIZE } from "../constants/config";

import { UIOpenSettings,UICloseSettings } from "./uiHelpers";


let previousSize: [number, number];
let previousPosition: [number, number];

async function saveSettingsWindowSizeAndPosition() {
    previousSize = await window.electronAPI.getWindowSize();
    previousPosition = await window.electronAPI.getWindowPosition();
}

async function resizeWindowForSettings() {
    await saveSettingsWindowSizeAndPosition();
    const [currentWidth, currentHeight] = await window.electronAPI.getWindowSize();
    if (currentWidth < LIMIT_WINDOWS_SIZE) {
        const [currentX, currentY] = await window.electronAPI.getWindowPosition();
        await window.electronAPI.setWindowSize(LIMIT_WINDOWS_SIZE, currentHeight);
        await window.electronAPI.setWindowPosition(currentX - (LIMIT_WINDOWS_SIZE - currentWidth), currentY);
    }
    UIOpenSettings();
}

async function closeSettings() {
    const [currentWidth, currentHeight] = await window.electronAPI.getWindowSize();
    const [currentX, currentY] = await window.electronAPI.getWindowPosition();

    if (currentWidth === LIMIT_WINDOWS_SIZE) {
        await window.electronAPI.setWindowSize(previousSize[0], previousSize[1]);
        await window.electronAPI.setWindowPosition(previousPosition[0], currentY);
    }

    UICloseSettings();
}

export { saveSettingsWindowSizeAndPosition, resizeWindowForSettings, closeSettings };
