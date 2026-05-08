export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_AD_CLIENTID,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AD_TENANTID}`,
        redirectUri: import.meta.env.VITE_AD_REDIRECTURI,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

export const loginRequest = {
    scopes: [`api://${import.meta.env.VITE_AD_APICLIENTID}/access_as_user`]
};