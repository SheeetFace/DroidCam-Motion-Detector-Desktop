export const domElements = {
    container:document.querySelector('.container') as HTMLCanvasElement,
    canvasOutput: document.getElementById('canvasOutput') as HTMLCanvasElement,
    toggleCheckbox: document.getElementById('checkbox') as HTMLInputElement,
    pinButton: document.getElementById('pin-button') as HTMLButtonElement,
    loaderImg: document.querySelector(".loader") as HTMLImageElement,
    switchMotion: document.querySelector(".switch") as HTMLDivElement,
    motionIndicator: document.querySelector('.motion-indicator') as HTMLDivElement,
    emptyUrlMessage: document.querySelector('.not-camera-url-alert') as HTMLDivElement,
    connectingLost: document.querySelector(".connection-lost") as HTMLDivElement,
    connecting: document.getElementById('connecting') as HTMLDivElement,
    img: document.getElementById('video-frame') as HTMLImageElement,
    applyNewUrlButton: document.getElementById('apply-new-url-btn') as HTMLButtonElement,
    baseUrlInput: document.getElementById('base-url') as HTMLInputElement,
    portInput: document.getElementById('port-input') as HTMLInputElement,

    settingsContainer:document.getElementById('settings-container') as HTMLDivElement,
    settings: document.getElementById('settings') as HTMLDivElement,
    resetSettingButton: document.getElementById("reset-settings-btn") as HTMLButtonElement,
    closeSettingsButton:document.getElementById('close-settings-btn') as HTMLButtonElement,

    batteryContainer:document.querySelector('.battery-container') as HTMLDivElement,
    batteryLevel: document.querySelector('.battery-level') as HTMLDivElement,
    batteryText: document.querySelector('.battery-text') as HTMLDivElement,

    droidcamControlsPanel: document.querySelector(".droidcam-controls-panel") as HTMLDivElement,
    controlsPanelButton: document.querySelector(".droidcam-controls-button") as HTMLButtonElement,
    flashlightButton: document.querySelector(".flashlight-button") as HTMLButtonElement,
    screenshotButton: document.querySelector(".screenshot-button") as HTMLButtonElement,
    autoFocusButton: document.querySelector(".auto-focus-button") as HTMLButtonElement,
    zoomInButton: document.querySelector(".zoomin-button") as HTMLButtonElement,
    zoomOutButton: document.querySelector(".zoomout-button") as HTMLButtonElement,

    borderColorTracking: document.querySelector(".border-color-tracking") as HTMLDivElement,
    borderColorRangeRed:document.getElementById('range-red') as HTMLInputElement,
    borderColorRangeGreen:document.getElementById('range-green') as HTMLInputElement,
    borderColorRangeBlue:document.getElementById('range-blue') as HTMLInputElement,

    bodyDiscord: document.querySelector(".wrapper-integrations-body-discord") as HTMLDivElement,
    bodyTelegram: document.querySelector(".wrapper-integrations-body-telegram") as HTMLDivElement,

    telegramBotTokenInput:document.getElementById('notification-url-input-telegram-bot-token') as HTMLInputElement,
    telegramChatIDInput:document.getElementById('notification-url-input-telegram-chat-id') as HTMLInputElement,
    telegramApplyButton: document.querySelector(".apply-notification-url-telegram") as HTMLButtonElement,

    discordWebhookInput: document.getElementById("notification-url-input-discord") as HTMLInputElement,
    discordApplyButton: document.querySelector(".apply-notification-url-discord") as HTMLButtonElement,

    linkItem: document.getElementById("link-item") as HTMLAnchorElement,

    appVersion: document.getElementById("app-version") as HTMLSpanElement,
    availableNewVersionApp: document.querySelector(".new-version-available") as HTMLDivElement,
};