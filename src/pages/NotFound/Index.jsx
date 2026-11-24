import { Link } from 'react-router-dom'
import styles from './Index.module.scss'

export function NotFound() {
  return (
    <main className={styles.page}>
      <p className={styles.codigo}>404</p>
      <h1>Esta página no existe</h1>
      <p className={styles.texto}>
        Puede que el enlace esté mal escrito o que la página ya no esté disponible.
      </p>
      <div className={styles.acciones}>
        <Link to="/" className={styles.principal}>Ir al inicio</Link>
        <Link to="/menu" className={styles.secundario}>Ver el menú</Link>
      </div>
    </main>
  )
}

export default NotFound