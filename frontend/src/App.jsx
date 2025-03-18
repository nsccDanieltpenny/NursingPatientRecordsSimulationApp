import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Nav from "./components/Nav";

import { UserProvider } from "./context/UserContext";
function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const navigate = useNavigate();

  // // Redirect to login page if not logged in
  // React.useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate('/login');
  //   }
  // }, [isLoggedIn, navigate]);

  return (
    <>
     <UserProvider>
      <div style={{display: 'flex', padding: '0px', justifyContent: 'center', alignItems: 'center'}}>
        <Nav />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Outlet />
      </div>
      </UserProvider>
    </>
  )
}
export default App;
