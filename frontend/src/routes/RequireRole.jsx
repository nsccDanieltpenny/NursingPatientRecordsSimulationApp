import { Suspense, lazy } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Spinner from "../components/Spinner";
import PropTypes from "prop-types";

const Unauthorized = lazy(() => import("./Unauthorized"));

/**
 * Requires that a user have one of the roles in the roles list
 */
const RequireRole = ({ roles }) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  if (loading) {
    return <Spinner />;
  }

  // Redirect to enrollment if user needs to enroll
  if (user?.needsEnrollment) {
    navigate("/enroll");
  }

  // Check if user has required role OR is a valid student (no roles but has classId)
  const hasRequiredRole = user?.roles?.find((role) => roles?.includes(role));
  const isValidStudent =
    user && !user.isInstructor && user.classId && user.isValid !== false;

  if (!(hasRequiredRole || (roles.includes("Nurse") && isValidStudent))) {
    return (
      <Suspense fallback={<Spinner />}>
        <Unauthorized />
      </Suspense>
    );
  }

  return <Outlet />;
};

RequireRole.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RequireRole;
