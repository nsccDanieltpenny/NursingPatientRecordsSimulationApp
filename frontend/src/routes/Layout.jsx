import { Outlet } from "react-router"; //react-router?
import Nav from "../components/Nav";

const Layout = () => {
  return (
    <>
      <div style={{ display: 'flex', padding: '0px', justifyContent: 'center', alignItems: 'center' }}>
        <Nav />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Outlet />
      </div>
    </>
  )
}

export default Layout;