import { useNavigate } from "react-router-dom";
import "../css/attendance_checkin.css";

export default function AttendanceFailed() {
  const navigate = useNavigate();

  return (
    <div className="attendance-checkin-page">
      <div className="attendance-checkin-card">
        <div className="attendance-checkin-status error">
          <span className="attendance-checkin-dot" />
          Scan failed
        </div>
        <h1 className="attendance-checkin-title">Unable to verify QR code</h1>
        <p className="attendance-checkin-message">
          This scan could not be verified.
        </p>
        <p className="attendance-checkin-detail">
          Please rescan the QR code from your instructor.
        </p>
        <div className="attendance-checkin-actions">
          <button
            className="attendance-checkin-button secondary"
            type="button"
            onClick={() => navigate("/login", { replace: true })}
          >
            Go to login
          </button>
        </div>
      </div>
    </div>
  );
}
