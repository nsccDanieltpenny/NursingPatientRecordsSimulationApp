import React from "react";
import { Outlet } from "react-router";
import Nav from "./ui/Nav";
import { UserProvider } from "../context/UserContext";

function App() {

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