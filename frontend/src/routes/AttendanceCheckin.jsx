import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { useUser } from "../context/UserContext";
import api from "../utils/api";
import "../css/attendance_checkin.css";

const getTicketParam = (searchParams) =>
  searchParams.get("attendanceTicket") || searchParams.get("ticket");

const statusLabels = {
  idle: "Waiting for ticket",
  auth: "Sign in required",
  checking: "Checking in",
  success: "Checked in",
  error: "Check-in failed",
};

export default function AttendanceCheckin() {
  const [searchParams] = useSearchParams();
  const ticket = useMemo(() => getTicketParam(searchParams), [searchParams]);

  const { user, loading } = useUser();
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("Preparing check-in...");
  const [detail, setDetail] = useState("Please wait a moment.");
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!ticket) {
      setStatus("error");
      setMessage("Missing attendance ticket.");
      setDetail("Please rescan the QR code from your instructor.");
      return;
    }
    sessionStorage.setItem("attendanceTicket", ticket);
  }, [ticket]);

  useEffect(() => {
    if (!ticket) return;

    if (!user) {
      setStatus("auth");
      setMessage("Sign in to confirm attendance.");
      setDetail("Use your school account to finish check-in.");
      return;
    }

    if (hasRunRef.current) return;
    hasRunRef.current = true;


    setStatus("checking");
    setMessage("Confirming your attendance...");
    setDetail("This usually takes only a few seconds.");

    api
      .post("/api/attendance/checkticket", { ticket })
      .then(() => {
        sessionStorage.removeItem("attendanceTicket");
        setStatus("success");
        setMessage("You are checked in.");
        setDetail("You can close this page or return to your dashboard.");
      })
      .catch((error) => {
        const code = error.response?.status;
        let errorMessage = "We could not confirm your attendance.";
        let errorDetail = "Please rescan the QR code and try again.";

        if (code === 404) {
          errorMessage = "Ticket not found.";
          errorDetail = "Please rescan the QR code.";
        } else if (code === 410) {
          errorMessage = "This ticket expired.";
          errorDetail = "Please rescan the QR code.";
        } else if (code === 401) {
          errorMessage = "You are not signed in.";
          errorDetail = "Please sign in to continue.";
        }

        setStatus("error");
        setMessage(errorMessage);
        setDetail(errorDetail);
      });
  }, [loading, ticket, user]);

  const handleSignIn = async () => {
    if (ticket) sessionStorage.setItem("attendanceTicket", ticket);
    await instance.loginRedirect(loginRequest);
  };

  return (
    <div className="attendance-checkin-page">
      <div className="attendance-checkin-card">
        <div className={`attendance-checkin-status ${status}`}>
          <span className="attendance-checkin-dot" />
          {statusLabels[status]}
        </div>
        <h1 className="attendance-checkin-title">Attendance Check-in</h1>
        <p className="attendance-checkin-message">{message}</p>
        <p className="attendance-checkin-detail">{detail}</p>
        <div className="attendance-checkin-actions">
          {status === "auth" && (
            <button
              className="attendance-checkin-button"
              type="button"
              onClick={handleSignIn}
            >
              Sign in to confirm
            </button>
          )}
          {(status === "success" || status === "error") && (
            <button
              className="attendance-checkin-button secondary"
              type="button"
              onClick={() => navigate("/", { replace: true })}
            >
              Go to dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
