import { domElements } from "../../utils/domElements";

import { startMotionTracking, stopMotionTracking } from "../../services/opencv";

import { UIAlwaysOnTop, UINotAlwaysOnTop } from '../../utils/uiHelpers';
import { resizeWindowForSettings,closeSettings } from "../../utils/settingsWindowManager";


export const initializeMainButtons = () => {

    domElements.toggleCheckbox.addEventListener('change', function() {
        if(domElements.toggleCheckbox.checked) startMotionTracking();
        else stopMotionTracking();
    });

    domElements.pinButton.addEventListener('click', async () => {
        const isAlwaysOnTop = await window.electronAPI.toggleAlwaysOnTop();

        if(isAlwaysOnTop) UIAlwaysOnTop();
        else UINotAlwaysOnTop();
    });

    domElements.settings.addEventListener('click', resizeWindowForSettings);
    domElements.closeSettingsButton.addEventListener('click', closeSettings);

    domElements.canvasOutput.addEventListener("click",() => {
        const isSettingOpen = domElements.settingsContainer.classList.contains("show");
        
        if(isSettingOpen) closeSettings();
    })
};
