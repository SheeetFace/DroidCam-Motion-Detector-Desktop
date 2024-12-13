import { domElements } from "../../utils/domElements";

import { toggleFlash, takePhoto, toggleAutofocus, zoomIn, zoomOut } from "../../services/droidcamApi";

import { UIToggleFlashlight,UIToggleCameraFlash } from "../../utils/uiHelpers";

const baseUrl = localStorage.getItem("camera-url");

export const initializeControlsPanel = ()=>{
    domElements.droidcamControlsPanel.style.display = "none";

    domElements.controlsPanelButton.addEventListener('click',() => {
        if(domElements.droidcamControlsPanel.style.display === "none"){
            domElements.droidcamControlsPanel.style.display = "block"
        }else{
            domElements.droidcamControlsPanel.style.display = "none"
        }
    });

    domElements.container.addEventListener("mouseleave", (event: MouseEvent) => { 
        const relatedTarget = event.relatedTarget as HTMLElement; 
        if(!domElements.droidcamControlsPanel.contains(relatedTarget)){
            domElements.droidcamControlsPanel.style.display = "none"; 
        }
    });

    domElements.flashlightButton.addEventListener('click', async () => {
        const result = await toggleFlash(baseUrl);

        if(result) UIToggleFlashlight();
        else console.error('Failed to toggle flash');
    });
    
    domElements.screenshotButton.addEventListener('click', async () => {
        const result = await takePhoto(baseUrl);

        if(result) UIToggleCameraFlash();
        else console.error('Failed to take photo');
    });
    
    domElements.autoFocusButton.addEventListener('click', async () => {
        const result = await toggleAutofocus(baseUrl);

        if(!result) console.error('Failed to toggle autofocus');
    });

    domElements.zoomInButton.addEventListener('click', async () => {
        const result = await zoomIn(baseUrl);

        if(!result) console.error('Failed to zoom in');
    });

    domElements.zoomOutButton.addEventListener('click', async () => {
        const result = await zoomOut(baseUrl);

        if(!result) console.error('Failed to zoom out');
    });
}
