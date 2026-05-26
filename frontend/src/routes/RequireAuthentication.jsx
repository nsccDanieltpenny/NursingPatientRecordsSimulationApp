import { Suspense, lazy } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Outlet } from "react-router-dom";
import Spinner from "../components/Spinner";

const Login = lazy(() => import("./Login"));

/**
 * Requires that a user be authenticated
 */
const RequireAuthentication = () => {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();

  if (inProgress !== "none") {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<Spinner />}>
        <Login />
      </Suspense>
    );
  }

  return <Outlet />;
};

export default RequireAuthentication;
