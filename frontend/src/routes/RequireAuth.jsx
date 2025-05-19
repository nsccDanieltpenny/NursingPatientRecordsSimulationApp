import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const RequireAuth = ({ allowedRoles }) => {
  const { user } = useUser();
  const location = useLocation();

  return (
    user?.roles?.find(role => allowedRoles?.includes(role))
      ? <Outlet />
      : user?.user 
        ? <Navigate to="/unauthorized" state={{ from: location }} replace /> 
        : <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;