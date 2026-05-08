import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig.js";

// Create a single MSAL instance to be shared across the app
const msalInstance = new PublicClientApplication(msalConfig);

export default msalInstance;
