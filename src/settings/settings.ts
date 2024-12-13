import { initializeSettingsListeners } from "./settingsListenerInitializations";
import { debouncedUpdateSetting, updateSettingValue, parseUrl } from "./settingsUtils";
import { loadSettingsFromLocalStorage, resetSettings } from "./settingsStorage";

import { domElements } from "../utils/domElements";

import {  UIUpdateValue,
          UIBorderColorTracking,
          UIToggleIntegrationBody,
          UIToggleTelegramButtonDisabled,
          UIToggleDiscordButtonDisabled,
          UIToggleCameraUrlButtonDisabled,
          UIApplyButtonSettings 
} from "../utils/uiHelpers";

import type { 
  Settings,
  SettingsKeys,
  DiscordSettings,
  TelegramSettings 
} from "../types";

type TypeInputValue = 'camera'|'telegram'|'discord';


export const settings:Settings = loadSettingsFromLocalStorage() as Settings;

initializeSettingsListeners();
updateUI();

function updateUI() {
  updateBasicSettings(settings);
  updateIntegrationsAndColors(settings);

  UIUpdateValue('telegram-interval', settings.integrations.telegram.interval);
  UIUpdateValue('discord-interval', settings.integrations.discord.interval);
}

export function validateGroupInputsAndToggleButton(event: Event) {
  const target = event.target as HTMLInputElement;
  const group = target.getAttribute('data-group');  
  if(!group) return;

  const inputs = document.querySelectorAll(`input[data-group="${group}"]`) ;
  let allValuesFilled = true;
  let shadowFirstInput = '';
  let shadowSecondInput = '';

  inputs.forEach((input:HTMLInputElement) => {
    if(input.value === '') allValuesFilled = false;

    const firstInputs = ['base-url','notification-url-input-telegram-bot-token','notification-url-input-discord'];
    const secondInputs = ['port-input','notification-url-input-telegram-chat-id'];

    if(firstInputs.includes(input.id)) shadowFirstInput = input.value;
    if(secondInputs.includes(input.id)) shadowSecondInput = input.value;
  });

  if(group === 'camera'){
    const newURL = `http://${shadowFirstInput}:${shadowSecondInput}/video`;
    UIToggleCameraUrlButtonDisabled((settings.getVideoSourceUrl() === newURL || !allValuesFilled))
  }else if(group === 'telegram'){
    const isTheSameToken = settings.integrations.telegram.botToken === shadowFirstInput;
    const isTheSameChatID = settings.integrations.telegram.chatID === shadowSecondInput;
    const isTheSameInputs = isTheSameToken && isTheSameChatID;

    UIToggleTelegramButtonDisabled(isTheSameInputs || !allValuesFilled); 
  }else if(group ==='discord'){
    const isTheSameWebhook = settings.integrations.discord.webhook === shadowFirstInput;

    UIToggleDiscordButtonDisabled(isTheSameWebhook || !allValuesFilled)
  }
}

export function updateSetting(event:Event){
  const target = event.target as HTMLInputElement;
  const settingName = target.id;
  const type = target.type;
  const value = parseInt(target.value);
  const colorRanges = ['range-red', 'range-green', 'range-blue'];

  if(settingName in settings && type === 'range') handleRangeSetting(settingName, value, target);
  else if(colorRanges.includes(settingName)) updateBorderColorTracking(settingName, value);
  else if(type === 'checkbox') handleCheckboxSetting(settingName, target);
}

function handleRangeSetting(settingName:string, value:number, target:HTMLInputElement) {
  if(settingName === "integrations") handleIntegrationSetting(value, target);
  else{
    UIUpdateValue(settingName, value);
    debouncedUpdateSetting(settings, settingName as SettingsKeys, value);
  }
}

function handleCheckboxSetting(settingName:string, target:HTMLInputElement) {
  const integrationType = settingName.split('cb4-9-')[1];

  if(integrationType === 'discord' || integrationType === 'telegram'){
    debouncedUpdateSetting(settings,`integrations.${integrationType}.isEnabled`, target.checked)
    UIToggleIntegrationBody(integrationType, target.checked);
  }
}

function handleIntegrationSetting(value: number, target: HTMLInputElement) {
  const isDiscordEnabled = settings.integrations.discord.isEnabled;
  const isTelegramEnabled = settings.integrations.telegram.isEnabled

  if(isDiscordEnabled || isTelegramEnabled){
    const isInsideDiscordContainer = !!target.closest('.notification-type-container-discord');  
    const isInsideTelegramContainer = !!target.closest('.notification-type-container-telegram');

    if(isInsideDiscordContainer && isDiscordEnabled){
      debouncedUpdateSetting(settings,'integrations.discord.interval',value);
      UIUpdateValue('discord-interval', value);
    }else if(isInsideTelegramContainer && isTelegramEnabled){
      debouncedUpdateSetting(settings,'integrations.telegram.interval',value);
      UIUpdateValue('telegram-interval', value);
    }else console.error('Neither Discord nor Telegram container found');
  }
}

function updateBorderColorTracking(settingName:string, value:number) {
  const borderColor = [...settings.borderColor];

  if(settingName === 'range-red') borderColor[0] = value;
  else if(settingName === 'range-green') borderColor[1] = value;
  else if(settingName === 'range-blue') borderColor[2] = value;

  UIBorderColorTracking(borderColor);
  debouncedUpdateSetting(settings,'borderColor', borderColor);
}

function updateBasicSettings(settings:Settings) {
  for (const [key, value] of Object.entries(settings)) {
    if(key === 'integrations') continue;
    
    const element = document.getElementById(key);
    if(!element || element.className.startsWith('integrations')) continue;

    UIUpdateValue(key, value);
    if(element instanceof HTMLInputElement && element.type === 'range') {
      element.value = value.toString();
    }
  }
  
  setInitialInputValues(settings)
  updateColorRanges(settings.borderColor)
}

function updateIntegrationsAndColors(settings:Settings) {
  const { integrations } = settings;

  for(const [type, settings] of Object.entries(integrations)){

    const checkbox = document.getElementById(`cb4-9-${type}`);
    const rangeInput = document.querySelector(`.integrations-${type}`) as HTMLInputElement;

    if(checkbox instanceof HTMLInputElement && rangeInput){
      const integrationSettings = settings as DiscordSettings | TelegramSettings;
      
      UIToggleIntegrationBody(type, integrationSettings.isEnabled);
      checkbox.checked = integrationSettings.isEnabled;
      rangeInput.value = integrationSettings.interval.toString();
    }
  }
}

function updateColorRanges(borderColor:number[]) {
  UIBorderColorTracking(borderColor);
  domElements.borderColorRangeRed.value=`${borderColor[0]}`
  domElements.borderColorRangeGreen.value=`${borderColor[1]}`
  domElements.borderColorRangeBlue.value=`${borderColor[2]}`
}

export function saveInputValue(type: TypeInputValue){

  if(type==='camera'){
    const newURL = `http://${domElements.baseUrlInput.value}:${domElements.portInput.value}/video`;
    if(domElements.baseUrlInput.value && domElements.portInput.value) {
        settings.setVideoSourceUrl(newURL);
        location.reload();
    }
  }else if(type==='telegram'){
    if(domElements.telegramBotTokenInput.value && domElements.telegramChatIDInput.value){
      const botTokenValue = domElements.telegramBotTokenInput.value;
      const chatID = domElements.telegramChatIDInput.value;

      updateSettingValue(settings,'integrations.telegram.botToken', botTokenValue);
      updateSettingValue(settings,'integrations.telegram.chatID', chatID);

      const isTheBotToken = settings.integrations.telegram.botToken === botTokenValue;
      const isTheSameChatID = settings.integrations.telegram.chatID === chatID;

      const isTheSameInputs = isTheBotToken && isTheSameChatID;

      UIToggleTelegramButtonDisabled(isTheSameInputs);
      UIApplyButtonSettings(domElements.telegramApplyButton); 
    }
  }else if(type === 'discord'){
    if(domElements.discordWebhookInput.value){
      updateSettingValue(settings,"integrations.discord.webhook",domElements.discordWebhookInput.value);
      UIToggleDiscordButtonDisabled(settings.integrations.discord.webhook === domElements.discordWebhookInput.value)
      UIApplyButtonSettings(domElements.discordApplyButton); 
    }
  }
}

function setInitialInputValues(settings:Settings){
  const url = settings.getVideoSourceUrl();
  const botToken =settings.integrations.telegram.botToken;
  const chatID =  settings.integrations.telegram.chatID;
  const webHook = settings.integrations.discord.webhook;

  if(url){
    const {baseUrl, port} = parseUrl(url);
    domElements.baseUrlInput.value= baseUrl || '';
    domElements.portInput.value= port || '';

    UIToggleCameraUrlButtonDisabled(true);
  }
  if(botToken && chatID){
    domElements.telegramBotTokenInput.value = botToken || '';
    domElements.telegramChatIDInput.value = chatID || '';
  }
  if(webHook){
    domElements.discordWebhookInput.value = webHook || '';
  }
}

export function handleResetSettings(){
  resetSettings(settings);
  location.reload();
}