import { Outlet } from "react-router"; //react-router?
import Nav from "../components/Nav";

const Layout = () => {
  return (
    <>

    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Nav />
        <div style={{ flex: 1, justifyContent: 'center', display: "flex" }}>
          <Outlet />
        </div>
    </div>

    </>
  )
}

export default Layout;