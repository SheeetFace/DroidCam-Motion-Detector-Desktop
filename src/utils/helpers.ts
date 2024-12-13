interface DebounceFunction {
    (...args: any[]): void;
}
interface Debounced {
    (...args: any[]): void;
}

export function debounce<T extends DebounceFunction>(func:T, wait:number):Debounced {
    let timeout: NodeJS.Timeout;

    return function(this: unknown, ...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function getVideoUrl(url:string) {
    return `${url}?t=${new Date().getTime()}`;
}

export const getBaseUrl = (url: string): string => {
    if(url) return url.split('/video')[0];
    else{
        console.error('Invalid URL: URL is empty or undefined');
        return '';
    } 
};

export function calculateExcludeHeight(percent:number): number {
    return Math.round(window.innerHeight * percent);
}
