import { startMotionTracking, videoPlaying} from "../services/opencv";

import { domElements } from "../utils/domElements";
import { getVideoUrl } from "../utils/helpers";
import { UISetConnectingText,UIShowLoader,UIHideLoader,UIDisableMotionButton,UIEnableMotionButton } from "../utils/uiHelpers";

import { startBatteryStatusUpdates, stopBatteryStatusUpdates } from "./battery/batteryStatus";

import { settings } from "../settings/settings";


export let img = domElements.img

let wasConnected = false;
let isLostConnected = false;

const handleImageLoad=()=>{
  console.log('Image loaded successfully');
  UIHideLoader();
  UIEnableMotionButton();
  startBatteryStatusUpdates(settings.getVideoSourceUrl());

  if(!videoPlaying){
    wasConnected = true;
    startMotionTracking(); 
  }
}

export const initializeVideoFrame = async() => {
  UISetConnectingText(settings.getVideoSourceUrl())
  UIShowLoader();
  UIDisableMotionButton();

  img.src = getVideoUrl(settings.getVideoSourceUrl());
  
  img.onerror = function() {
    console.log('Initial image load failed, attempting to reconnect...');
    attemptReconnect();
  };

  img.onload = function() {
    handleImageLoad();
  }
}
function attemptReconnect() {
  const videoSourceUrl = settings.getVideoSourceUrl();

  const oldImg = document.getElementById('video-frame');
  if (oldImg) oldImg.remove();

  const newImg = document.createElement('img');
  newImg.id = 'video-frame';
  newImg.src = getVideoUrl(videoSourceUrl);

  newImg.onload = function() {
      img = newImg;
      handleImageLoad();
  };

  newImg.onerror = function() {
      console.log('Error loading image, attempting to reconnect...');
      UISetConnectingText(videoSourceUrl);
      if (!isLostConnected) setTimeout(attemptReconnect, 500);
  };

  domElements.container.insertBefore(newImg, domElements.container.firstChild);
}

async function checkImageAvailability() {
  if(wasConnected){
      try{
          await fetch(settings.getVideoSourceUrl(), { method: 'GET' });
          if(domElements.connectingLost.style.display !== "none") domElements.connectingLost.style.display = "none";
      }catch(error){
          console.log({error})
          if(domElements.connectingLost.style.display !== "block") domElements.connectingLost.style.display = "block";

          UISetConnectingText(settings.getVideoSourceUrl())

          if(!isLostConnected){
              isLostConnected = true;
              stopBatteryStatusUpdates();
              const shouldRestart = await window.electronAPI.showDialog();
                if(shouldRestart){
                  clearInterval(intervalId);
                  location.reload();
                }
               //! problem with lost signal and resuming it, errors and a reboot request window remain
          }
      }
  }
}
const intervalId = setInterval(checkImageAvailability, 3000);

