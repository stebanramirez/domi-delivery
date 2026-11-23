import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Index'

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default Layout