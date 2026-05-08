import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext.jsx';
import { MsalProvider } from "@azure/msal-react";
import msalInstance from './msalInstance.js';
import App from './App.jsx';

const router = createBrowserRouter([
  {
    path: "/*",
    element: (
      <UserProvider>
        <App />
      </UserProvider>
    ),
  },
]);

// Initialize MSAL before rendering
msalInstance.initialize().then(() => {
  // If we're in the process of logging out, clear all MSAL data
  if (localStorage.getItem('isLoggingOut') === 'true') {
    const accounts = msalInstance.getAllAccounts();
    accounts.forEach(account => {
      msalInstance.setActiveAccount(null);
    });
    sessionStorage.clear();
  }
  
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <RouterProvider router={router} />
      </MsalProvider>
    </StrictMode>,
  );
});