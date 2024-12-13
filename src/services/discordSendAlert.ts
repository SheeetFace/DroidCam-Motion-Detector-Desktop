import { domElements } from "../utils/domElements";

export const discordSnapshotAlert = async (webhook:string) => {
  try{
    const canvas = domElements.canvasOutput;
    if(!canvas) throw new Error("Canvas element not found");
    
    await sendToDiscord(canvas, webhook);
    
  }catch(error){
    console.error('Error processing and sending snapshot to Discord: ', error);
  }
};

const sendToDiscord = async (canvas:HTMLCanvasElement, webhook:string) => {
  try{
    const blob = await new Promise<Blob|null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
    });

    if(!blob) throw new Error("Failed to create image blob from canvas");
    
    const formData = new FormData();
    
    formData.append('file', blob, 'snapshot.jpg');

    const response = await fetch(webhook, {
      method: 'POST',
      body: formData,
    });

    if(!response.ok) throw new Error(`HTTP-Error: ${response.status}`);

    return true;

  }catch(error){
    console.error('Error sending photo to Discord: ', error);
    return false;
  }
};