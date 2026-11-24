import { Link } from 'react-router-dom'
import styles from './Index.module.scss'

function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.contenido}>
        <div className={styles.marca}>
          <h2>Domi</h2>
          <p>Tu comida favorita, a la puerta de tu casa.</p>
        </div>

        <nav className={styles.columna} aria-label="Enlaces">
          <h3>Navegar</h3>
          <Link to="/">Inicio</Link>
          <Link to="/menu">Menú</Link>
          <Link to="/zonas">Zonas de entrega</Link>
          <Link to="/pedidos">Mis pedidos</Link>
        </nav>

        <div className={styles.columna}>
          <h3>Restaurante</h3>
          <p>San Fernando, Cali</p>
          <p>Todos los días</p>
          <p>11:00 a. m. – 10:00 p. m.</p>
        </div>
      </div>

      <div className={styles.legal}>
        <span>© {anio} Domi · Proyecto final de Estructuras de Datos II</span>
      </div>
    </footer>
  )
}

export default Footer