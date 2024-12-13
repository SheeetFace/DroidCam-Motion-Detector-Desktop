interface Window {
    electronAPI: {
        toggleAlwaysOnTop: () => Promise<boolean>;
        openSettings: () => Promise<void>;
        closeSettings: () => Promise<void>;
        showDialog: () => Promise<boolean>;
        goToLink: (url: string) => Promise<void>;
        getWindowSize: () => Promise<[number, number]>;
        setWindowSize: (width: number, height: number) => Promise<void>;
        getWindowPosition: () => Promise<[number, number]>;
        setWindowPosition: (x: number, y: number | null) => Promise<void>;
        changeTrayIcon:(alert:boolean)=>Promise<void>;
    };
}
