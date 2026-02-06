export const msalConfig = {
    auth: {
        clientId: `${import.meta.env.AD_CLIENTID}`,
        authority: `https://login.microsoftonline.com/${import.meta.env.AD_TENANTID}`,
        redirectUri: `${import.meta.env.AD_REDIRECTURI}`,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

export const loginRequest = {
    scopes: [`api://${import.meta.env.AD_APICLIENTID}/access_as_user`]
};