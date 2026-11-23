import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useCart } from '../../../context/CartContext'
import styles from './Index.module.scss'

function claseLink({ isActive }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link
}

function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const { count } = useCart()

  return (
    <header className={styles.nav}>
      <Link to="/" className={styles.logo}>Domi</Link>

      <nav className={styles.links}>
        <NavLink to="/" end className={claseLink}>Inicio</NavLink>
        <NavLink to="/menu" className={claseLink}>Menú</NavLink>
        {user && <NavLink to="/pedidos" className={claseLink}>Mis pedidos</NavLink>}
        {isAdmin && <NavLink to="/admin" className={claseLink}>Administración</NavLink>}
      </nav>

      <div className={styles.right}>
        <Link to="/carrito" className={styles.boton}>
          Carrito{count > 0 && ` (${count})`}
        </Link>
        {user ? (
          <>
            <span className={styles.nombre}>{profile?.full_name || user.email}</span>
            <button type="button" onClick={signOut} className={styles.boton}>Cerrar sesión</button>
          </>
        ) : (
          <Link to="/login" className={styles.boton}>Ingresar</Link>
        )}
      </div>
    </header>
  )
}

export default Navbar