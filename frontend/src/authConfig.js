export const msalConfig = {
    auth: {
        clientId: "4e0040eb-c063-462f-80c7-4fdd3e539087",
        authority: "https://login.microsoftonline.com/b665cc9e-52ca-43e5-b2e6-86c18a12b59a",
        redirectUri: "http://localhost:5173",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

export const loginRequest = {
    scopes: ["api://c7012d5d-9077-4ae2-b0c6-4cc7938af46d/access_as_user"]
};