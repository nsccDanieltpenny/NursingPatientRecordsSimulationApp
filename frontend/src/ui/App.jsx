import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Nav from "./components/Nav";
import { UserProvider } from "./context/UserContext";
import { useUser } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

// Internal component that uses the context
function AppContent() {
  const { isAuthenticated, loading } = useUser();
  const navigate = useNavigate();

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div style={{ display: 'flex', padding: '0px', justifyContent: 'center', alignItems: 'center' }}>
        <Nav />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Outlet />
      </div>
    </>
  );
}

export default App;