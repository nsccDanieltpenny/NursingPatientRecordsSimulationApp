import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Spinner from "../components/Spinner";

const RequireAuth = ({ allowedRoles }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  // Redirect to enrollment if user needs to enroll
  if (user?.needsEnrollment) {
    return <Navigate to="/enroll" state={{ from: location }} replace />;
  }

  // Check if user has required role OR is a valid student (no roles but has classId)
  const hasRequiredRole = user?.roles?.find(role => allowedRoles?.includes(role));
  const isValidStudent = user && !user.isInstructor && user.classId && user.isValid !== false;
  
  return (
    hasRequiredRole || isValidStudent
      ? <Outlet />
      : user
        ? <Navigate to="/unauthorized" state={{ from: location }} replace /> 
        : <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;