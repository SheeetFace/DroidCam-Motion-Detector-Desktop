import { domElements } from "../utils/domElements";

import { validateGroupInputsAndToggleButton,updateSetting,saveInputValue, handleResetSettings} from "./settings";

import { debounce } from "../utils/helpers";

export function initializeSettingsListeners() {
  initializeUrlInputs();
  initializeSettingsInputs();
  initializeLinks();
}

function initializeUrlInputs() {

    domElements.resetSettingButton.addEventListener('click', handleResetSettings)

    domElements.baseUrlInput.addEventListener('input',debounce(validateGroupInputsAndToggleButton,100));
    domElements.portInput.addEventListener('input',debounce(validateGroupInputsAndToggleButton,100));
    domElements.applyNewUrlButton.addEventListener('click', ()=>saveInputValue('camera'));

    domElements.telegramBotTokenInput.addEventListener('input', debounce(validateGroupInputsAndToggleButton,100));
    domElements.telegramChatIDInput.addEventListener('input', debounce(validateGroupInputsAndToggleButton,100));
    domElements.telegramApplyButton.addEventListener('click',()=>saveInputValue('telegram'))

    domElements.discordWebhookInput.addEventListener('input',debounce(validateGroupInputsAndToggleButton,100));
    domElements.discordApplyButton.addEventListener("click",()=>saveInputValue('discord'))
}

function initializeSettingsInputs() {
    const inputs = document.querySelectorAll('input[type="range"], input[type="text"], input[type="password"],input[type="checkbox"], input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', updateSetting);
    });
}

function initializeLinks() {
    const links = document.querySelectorAll('[id^="link-item"]');
    links.forEach(link => {
        link.addEventListener("click",(event)=>{
            event.preventDefault();
            const target = event.target as HTMLAnchorElement;
            const href = target.href;
            window.electronAPI.goToLink(href);
        })
    })
}


