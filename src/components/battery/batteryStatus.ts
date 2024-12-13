import { getBatteryStatus } from "../../services/droidcamApi";

import { domElements } from "../../utils/domElements";

import { UIUpdateBatteryColor,UIUpdateBatteryLevel } from "../../utils/uiHelpers";

let batteryIntervalId: NodeJS.Timeout;

export const startBatteryStatusUpdates = (baseUrl: string) => {
  if(!domElements.batteryText || !baseUrl) return;

  const updateBatteryStatus = async () => {
    try{
      const batteryLevel = await getBatteryStatus(baseUrl);
      if(batteryLevel === -1) setTimeout(updateBatteryStatus,1000);
      else{
        UIUpdateBatteryLevel(batteryLevel);
        UIUpdateBatteryColor(batteryLevel);
      }
    }catch(error){
      console.error('Error fetching battery status:', error);
    }
  };

  updateBatteryStatus();
  batteryIntervalId = setInterval(updateBatteryStatus, 300000);
};

export const stopBatteryStatusUpdates = () => {
  clearInterval(batteryIntervalId);
};
