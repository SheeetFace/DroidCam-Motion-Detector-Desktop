import { UIShowMotionIndicator, UIHideMotionIndicator } from './uiHelpers';
import { telegramSnapshotAlert } from '../services/telegramSendAlert';
import { discordSnapshotAlert } from '../services/discordSendAlert';

import { settings } from '../settings/settings';

import beepSound from '../assets/beep.mp3?asset';

type HandleMotionEvents = (
    trackedObjectsLength: number,
    alertVolume: number,
    alertInterval: number
) => void;

let lastSoundTime = 0;
let audio: HTMLAudioElement | null = null;
let lastTelegramAlertTime = 0;
let lastDiscordAlertTime = 0;

export const handleMotionEvents: HandleMotionEvents =(trackedObjectsLength,alertVolume,alertInterval)=>{
  if(trackedObjectsLength > 0) handleMotionDetected(alertVolume, alertInterval);
  else handleNoMotion();
};

const handleMotionDetected = (alertVolume:number, alertInterval:number): void => {
  UIShowMotionIndicator();
  window.electronAPI.changeTrayIcon(true);

  if(alertVolume > 0) handleAudioAlert(alertVolume, alertInterval);
  if(settings.integrations.telegram.isEnabled) handleTelegramAlert();
  if(settings.integrations.discord.isEnabled) handleDiscordAlert();
  
};

const handleAudioAlert = (alertVolume:number, alertInterval:number): void => {
    const currentTime = Date.now();

    if(currentTime - lastSoundTime >= alertInterval){
      lastSoundTime = currentTime;
      
      if(!audio) audio = new Audio(beepSound);
      
      audio.volume = alertVolume / 100;
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
};

const handleTelegramAlert = (): void => {
  const currentTime = Date.now();
  const { interval, botToken, chatID } = settings.integrations.telegram;

  if(botToken && chatID){   
    if(currentTime - lastTelegramAlertTime >= interval){
      lastTelegramAlertTime = currentTime;
      telegramSnapshotAlert(botToken, chatID);
    }
  }else console.error('Error: botToken or chatID is empty');
};

const handleDiscordAlert = (): void => {
  const currentTime = Date.now();
  const { interval, webhook } = settings.integrations.discord;
  
  if(currentTime - lastDiscordAlertTime >= interval){
    lastDiscordAlertTime = currentTime;
    discordSnapshotAlert(webhook);
  }
};

const handleNoMotion = (): void => {
  window.electronAPI.changeTrayIcon(false);
  UIHideMotionIndicator();
};


