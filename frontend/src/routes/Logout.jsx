import { useEffect } from "react";
import { useUser } from "../context/UserContext";

export default function Logout() {
  const { logout } = useUser();
  useEffect(() => {
    logout();
  }, [logout]);

  return null;
}
