import { useIsAuthenticated } from "@azure/msal-react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Spinner from "../components/Spinner";
import PropTypes from "prop-types";

const RequireAuth = ({ allowedRoles }) => {
  const isAuthenticated = useIsAuthenticated();
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to enrollment if user needs to enroll
  if (user?.needsEnrollment) {
    return <Navigate to="/enroll" state={{ from: location }} replace />;
  }

  // Check if user has required role OR is a valid student (no roles but has classId)
  const hasRequiredRole = user?.roles?.find((role) =>
    allowedRoles?.includes(role),
  );
  const isValidStudent =
    user && !user.isInstructor && user.classId && user.isValid !== false;

  if (!(hasRequiredRole || isValidStudent)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RequireAuth;
