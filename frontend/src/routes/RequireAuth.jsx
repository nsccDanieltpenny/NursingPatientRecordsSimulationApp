import { Suspense, lazy } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Spinner from "../components/Spinner";
import PropTypes from "prop-types";

const Login = lazy(() => import("./Login"));
const Unauthorized = lazy(() => import("./Unauthorized"));

const RequireAuth = ({ allowedRoles }) => {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const { user, loading } = useUser();
  const navigate = useNavigate();

  if (!isAuthenticated && inProgress === "none") {
    return (
      <Suspense fallback={<Spinner />}>
        <Login />
      </Suspense>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  // Redirect to enrollment if user needs to enroll
  if (user?.needsEnrollment) {
    navigate("/enroll");
  }

  // Check if user has required role OR is a valid student (no roles but has classId)
  const hasRequiredRole = user?.roles?.find((role) =>
    allowedRoles?.includes(role),
  );
  const isValidStudent =
    user && !user.isInstructor && user.classId && user.isValid !== false;

  if (!(hasRequiredRole || isValidStudent)) {
    return (
      <Suspense fallback={<Spinner />}>
        <Unauthorized />
      </Suspense>
    );
  }

  return <Outlet />;
};

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RequireAuth;
