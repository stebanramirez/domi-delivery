import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useCart } from '../../../context/CartContext'
import styles from './Index.module.scss'

function Navbar() {
  const { session, profile, isAdmin, signOut } = useAuth()
  const { count } = useCart()

  const nombre = profile?.full_name || profile?.name || session?.user?.email

  const claseLink = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.activo}` : styles.link

  return (
    <header className={styles.navbar}>
      <div className={styles.contenido}>
        <Link to="/" className={styles.logo}>Domi</Link>

        <nav className={styles.links}>
          <NavLink to="/" end className={claseLink}>Inicio</NavLink>
          <NavLink to="/menu" className={claseLink}>Menú</NavLink>
          <NavLink to="/zonas" className={claseLink}>Zonas de entrega</NavLink>
          {session && <NavLink to="/pedidos" className={claseLink}>Mis pedidos</NavLink>}
          {isAdmin && <NavLink to="/admin" className={claseLink}>Administración</NavLink>}
        </nav>

        <div className={styles.derecha}>
          <Link to="/carrito" className={styles.carrito}>
            Carrito
            {count > 0 && <span className={styles.contador}>{count}</span>}
          </Link>

          {session ? (
            <>
              <span className={styles.nombre}>{nombre}</span>
              <button type="button" className={styles.salir} onClick={signOut}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" className={styles.ingresar}>Ingresar</Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar