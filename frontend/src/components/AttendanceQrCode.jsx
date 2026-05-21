import { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { TOTP } from "totp-generator";
import QRCode from "react-qr-code";

const TIMEOUT_PERIOD = 15;

function AttendanceQrCode({ attendanceId, secret, type }) {
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(TIMEOUT_PERIOD);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const expiresRef = useRef(null);
  const timeoutRef = useRef(null);

  const refresh = useCallback(async () => {
  
    if (!secret) return;

    try {
      // Generate new code
      const { otp, expires } = await TOTP.generate(secret, {
        period: TIMEOUT_PERIOD,
        digits: 6,
        algorithm: "SHA-1"
      });
      setCode(otp);
      expiresRef.current = expires;
      // Schedule next refresh exactly when this code expires
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => refresh(), expires - Date.now());
    } catch (err){
      console.error("TOTP error:", err)
      setCode("");
      setError("Invalid secret key");
    }
    
  }, [secret]);

  // Tick every second only to update the progress bar
  useEffect(() => {
    const tick = () => {
      if (expiresRef.current) {
        setSecondsLeft(
          Math.max(0, Math.ceil((expiresRef.current - Date.now()) / 1000)),
        );
      }
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Refresh the code
  useEffect(() => {
    refresh()
    return () => clearTimeout(timeoutRef.current);
  }, [refresh]);

  // Update the URL when the code changes
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL;
    setUrl(`${apiBase}/api/attendance/checkin?id=${attendanceId}&code=${code}&type=${type}`);
  }, [attendanceId, code]);

  // DEBUG FOR VISITING QR CODE URL FROM LOCALHOST
  useEffect(() => {
    console.log("Generated URL:", url);
  }, [url]);


  const progress = expiresRef.current
    ? ((TIMEOUT_PERIOD -
        Math.max(0, (expiresRef.current - Date.now()) / 1000)) /
        (TIMEOUT_PERIOD - 1)) *
      100
    : 0;
  const urgent = secondsLeft <= 5;

  if (error)
    return (
      <div
        style={{
          margin: 0,
          fontSize: 13,
          color: "#A32D2D",
          textAlign: "center",
        }}
      >
        {error}
      </div>
    );
  return (
    <div
      style={{
        height: "auto",
        width: "100%",
        maxWidth: "95vh",
        aspectRatio: "1/1",
        margin: "0 auto",
      }}
    >
      {/* Progress Bar */}
      <div
        style={{
          position: "relative",
          margin: "0 16px",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            top: 0,
            height: 4,
            width: `${progress}%`,
            background: urgent ? "#E24B4A" : "#1D9E75",
            transition: "width 0.98s linear, background 0.3s",
          }}
        />
      </div>

      {/* QR Code "quite zone" */}
      <div
        style={{
          padding: "16px",
          background: "white",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        {/* QR Code */}
        <QRCode
          size={256}
          value={url}
          level="M" // Medium level of error correction
          style={{
            height: "auto",
            width: "100%",
          }}
          viewBox={`0 0 256 256`}
        />
      </div>
    </div>
  );
}

AttendanceQrCode.propTypes = {
  attendanceId: PropTypes.number.isRequired,
  secret: PropTypes.string.isRequired,
};

export default AttendanceQrCode;
