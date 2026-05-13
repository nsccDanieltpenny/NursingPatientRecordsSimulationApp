import { IdleTimerProvider } from 'react-idle-timer';
import { useNavigate } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../authConfig';

const pca = new PublicClientApplication(msalConfig);

export default function IdleSessionManager({ children }) {
  const navigate = useNavigate();

  const handleOnIdle = () => {
    console.log("Idle for 5 minutes — logging out.");

    // Clear MSAL tokens
    try {
      pca.logoutPopup?.();
      pca.logoutRedirect?.();
    } catch (err) {
      console.warn("MSAL logout failed, continuing with local cleanup.");
    }

    // Clear local/session storage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login
    navigate("/login", { replace: true });
  };

  return (
    <IdleTimerProvider
      timeout={5 * 60 * 1000} // x * y * z. X is amount of time to allow idle in minutes, 1 = 1 minute, 5 = 5 minutes, 0.5 = 30 seconds, etc...
      onIdle={handleOnIdle}
      debounce={500}
    >
      {children}
    </IdleTimerProvider>
  );
}
