import PropTypes from "prop-types";
import { IdleTimerProvider } from "react-idle-timer";
import { useUser } from "../context/UserContext";
import { useIsAuthenticated } from "@azure/msal-react";

export default function IdleSessionManager({ children }) {
  const { logout } = useUser();
  const isAuthenticated = useIsAuthenticated();

  const handleOnIdle = () => {
    if (isAuthenticated) {
      console.info("Idle for 15 minutes — logging out.");
      logout();
    }
  };

  return (
    <IdleTimerProvider
      timeout={15 * 60 * 1000} // x * y * z. X is amount of time to allow idle in minutes, 1 = 1 minute, 5 = 5 minutes, 0.5 = 30 seconds, etc...
      onIdle={handleOnIdle}
      debounce={500}
    >
      {children}
    </IdleTimerProvider>
  );
}

IdleSessionManager.propTypes = {
  children: PropTypes.node,
};
