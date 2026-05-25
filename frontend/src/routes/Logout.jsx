import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    // Clear all session storage (and MSAL cache)
    sessionStorage.clear();
    // Force a hard navigation to the home page
    window.location.replace("/");
  }, []);

  return null;
}
