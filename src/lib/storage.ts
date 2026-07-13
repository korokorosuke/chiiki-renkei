export function getLocalStorage(key: string): string{
    const val = localStorage.getItem(key);
    if(val){
        return val;
    }else{
        return "";
    }
}

export function setLocalStorage(key: string, value: string){
    localStorage.setItem(key, value);
}

export function removeLocalStorage(key: string){
    localStorage.removeItem(key);
}

export function getSessionStorage(key: string): string{
    const val = sessionStorage.getItem(key);
    if(val){
        return val;
    }else{
        return "";
    }
}

export function setSessionStorage(key: string, value: string){
    sessionStorage.setItem(key, value);
}

export function removeSessionStorage(key: string){
    sessionStorage.removeItem(key);
}