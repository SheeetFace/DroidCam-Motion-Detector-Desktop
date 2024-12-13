import { domElements } from "../utils/domElements";

export const telegramSnapshotAlert = async (token:string, chatID:string) => {
  try{
    const canvas = domElements.canvasOutput;
    if(!canvas) throw new Error("Canvas element not found");
    
    await sendToTelegram(canvas, chatID, token);
    
  }catch(error){
    console.error('Error processing and sending snapshot: ', error);
  }
};

const sendToTelegram = async (canvas:HTMLCanvasElement, chatId:string, token:string) => {
  try {
    const url = `https://api.telegram.org/bot${token}/sendPhoto`;
    
    const blob = await new Promise<Blob|null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
    });

    if(!blob) throw new Error("Failed to create image blob from canvas");
    
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', blob, 'snapshot.jpg');

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if(!response.ok) throw new Error(`HTTP-Error: ${response.status}`);

    return true;

  }catch(error){
    console.error('Error sending photo to Telegram: ', error);
    return false;
  }
};
