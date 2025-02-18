import React from "react";
import { Outlet } from "react-router";
import Nav from "./ui/Nav";

function App() {

  return (
    <>

      <div style={{display: 'flex', padding: '0px', justifyContent: 'center', alignItems: 'center'}}>
        <Nav />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Outlet />
      </div>
    </>
  )
}
export default App;