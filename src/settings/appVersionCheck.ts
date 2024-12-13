export const appVersionCheck = async ()=>{
    // @ts-expect-error -> later
    const url = import.meta.env.VITE_APP_VERSION_DOMAIN;

    try{
        const response= await fetch(url);
        
        return await response.json();     
        
    }catch(error){
        console.log(error);
    }
}