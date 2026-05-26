import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
import { MsalProvider } from "@azure/msal-react";
import { EventType } from "@azure/msal-browser";
import msalInstance from "./msalInstance.js";
import App from "./App.jsx";
import IdleSessionManager from "./components/IdleSessionManager.jsx";

import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Initialize MSAL before rendering
msalInstance.initialize().then(() => {
  // Default to using the first account if no account is active on page load
  if (
    !msalInstance.getActiveAccount() &&
    msalInstance.getAllAccounts().length > 0
  ) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
  }

  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const account = event.payload;
      msalInstance.setActiveAccount(account);
    } else if (event.eventType === EventType.LOGOUT_SUCCESS) {
      sessionStorage.clear();
    }
  });
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter>
        <MsalProvider instance={msalInstance}>
          <UserProvider>
            <IdleSessionManager>
              <App />
            </IdleSessionManager>
          </UserProvider>
        </MsalProvider>
      </BrowserRouter>
    </StrictMode>,
  );
});
