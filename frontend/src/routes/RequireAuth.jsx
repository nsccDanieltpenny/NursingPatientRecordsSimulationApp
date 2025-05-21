import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Spinner from "../components/Spinner";

const RequireAuth = ({ allowedRoles }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  return (
    user?.roles?.find(role => allowedRoles?.includes(role))
      ? <Outlet />
      : user?.user 
        ? <Navigate to="/unauthorized" state={{ from: location }} replace /> 
        : <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;