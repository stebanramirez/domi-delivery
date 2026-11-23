import { Route, Routes } from 'react-router-dom'
import Layout from '../components/Shared/Layout/Index'
import Home from '../pages/Home/Index'
import Menu from '../pages/Menu/Index'
import Login from '../pages/Login/Index'
import Cart from '../pages/Cart/Index'
import Orders from '../pages/Orders/Index'
import Dashboard from '../pages/Admin/Dashboard/Index'
import NotFound from '../pages/NotFound/Index'
import UserRoutes from './UserRoutes'
import AdminRoutes from './AdminRoutes'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Públicas */}
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />

        {/* Privadas: solo con sesión iniciada */}
        <Route element={<UserRoutes />}>
          <Route path="/carrito" element={<Cart />} />
          <Route path="/pedidos" element={<Orders />} />
        </Route>

        {/* Solo administrador */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin" element={<Dashboard />} />
        </Route>

        {/* Cualquier otra dirección */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes