import PropTypes from "prop-types";
import { IdleTimerProvider } from "react-idle-timer";
import { useNavigate } from "react-router-dom";

export default function IdleSessionManager({ children }) {
  const navigate = useNavigate();

  const handleOnIdle = () => {
    console.info("Idle for 15 minutes — logging out.");

    // Navigate to logout page
    navigate("/logout");
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
