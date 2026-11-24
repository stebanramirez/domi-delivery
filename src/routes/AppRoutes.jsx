import { Route, Routes } from 'react-router-dom'
import Layout from '../components/Shared/Layout/Index'
import UserRoutes from './UserRoutes'
import AdminRoutes from './AdminRoutes'
import Home from '../pages/Home/Index'
import Login from '../pages/Login/Index'
import Menu from '../pages/Menu/Index'
import Cart from '../pages/Cart/Index'
import Zones from '../pages/Zones/Index'
import Checkout from '../pages/Checkout/Index'
import Orders from '../pages/Orders/Index'
import Tracking from '../pages/Tracking/Index'
import Dashboard from '../pages/Admin/Dashboard/Index'
import AdminOrders from '../pages/Admin/Orders/Index'
import NotFound from '../pages/NotFound/Index'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Rutas públicas */}
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/zonas" element={<Zones />} />

        {/* Rutas privadas: usuario con sesión */}
        <Route element={<UserRoutes />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/pedidos/:id" element={<Tracking />} />
        </Route>

        {/* Rutas privadas: solo administrador */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/pedidos" element={<AdminOrders />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes