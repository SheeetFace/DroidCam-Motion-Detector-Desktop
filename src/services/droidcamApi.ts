import { getBaseUrl } from "../utils/helpers";

// baseUrl like 'http://192.168.0.107:4747'

const sendCommand = async (baseUrl: string, command: string): Promise<boolean> => {
    if(!baseUrl) return false;
    
    try{
        const response = await fetch(`${getBaseUrl(baseUrl)}${command}`);
        return response.ok;
    }catch (error){
        console.error('Error sending command:', error);
        return false;
    }
};

const getBatteryStatus = async (baseUrl: string): Promise<number> => {
    if(!baseUrl) return -1;

    try{
        const response = await fetch(`${getBaseUrl(baseUrl)}/battery`);
        return await response.json();
    }catch(error){
        console.error('Error getting battery status:', error);
        return -1;
    }
};

/**
 * Takes a photo using the phone's camera.
 * This command exclusively triggers the camera to capture a photo and store it on the phone.
 */
const takePhoto = async (baseUrl: string): Promise<boolean> => 
    sendCommand(baseUrl, '/cam/1/takepic');

const toggleFlash = async (baseUrl: string): Promise<boolean> => 
    sendCommand(baseUrl, '/cam/1/led_toggle');

const toggleAutofocus = async (baseUrl: string): Promise<boolean> =>
    sendCommand(baseUrl, '/cam/1/af');
  
const zoomOut = async (baseUrl: string): Promise<boolean> =>
    sendCommand(baseUrl, `/cam/1/zoomout`);

const zoomIn = async (baseUrl: string): Promise<boolean> =>
    sendCommand(baseUrl, `/cam/1/zoomin`);
  
  
export {
    sendCommand,
    getBatteryStatus,
    toggleFlash,
    takePhoto,
    toggleAutofocus,
    zoomOut,
    zoomIn,
};