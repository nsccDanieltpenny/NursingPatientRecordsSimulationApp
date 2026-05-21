import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
import { MsalProvider } from "@azure/msal-react";
import msalInstance from "./msalInstance.js";
import App from "./App.jsx";
import IdleSessionManager from "./components/IdleSessionManager.jsx";

// Initialize MSAL before rendering
msalInstance.initialize().then(() => {
  // If we're in the process of logging out, clear all MSAL data
  if (localStorage.getItem("isLoggingOut") === "true") {
    const accounts = msalInstance.getAllAccounts();
    accounts.forEach(() => {
      msalInstance.setActiveAccount(null);
    });
    sessionStorage.clear();
  }

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
