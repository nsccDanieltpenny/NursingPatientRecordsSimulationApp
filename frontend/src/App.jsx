import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Nav from "./components/Nav";
import ProtectedComponent from "./components/ProtectedComponent";

import { UserProvider, useUser } from "./context/UserContext";
function App() {

  // Redirect to login page if not logged in
  // React.useEffect(() => {
  //   if (!user && !loading) {
  //     navigate('/login');
  //   }
  // }, [user,loading]);

  return (
    <>
      <UserProvider>
        <ProtectedComponent>
          <div className="position-fixed w-100" style={{ zIndex:'999',display: 'flex', padding: '0px', justifyContent: 'center', alignItems: 'center' }}>
            <Nav />
          </div>
          <div style={{paddingTop:'60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Outlet />
          </div>
        </ProtectedComponent>
      </UserProvider>
    </>
  )
}
export default App;
