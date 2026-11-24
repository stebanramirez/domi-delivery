import { Link } from 'react-router-dom'
import styles from './Index.module.scss'

function Dashboard() {
  return (
    <main className={styles.page}>
      <h1>Administración</h1>
      <p className={styles.sub}>Gestiona los pedidos y el menú de Domi.</p>

      <div className={styles.grid}>
        <Link to="/admin/pedidos" className={styles.card}>
          <h2>Pedidos</h2>
          <p>Cola de espera, estados y chat con los clientes.</p>
        </Link>
        <Link to="/admin/platos" className={styles.card}>
          <h2>Platos</h2>
          <p>Crea, edita, oculta y sube fotos de los platos.</p>
        </Link>
      </div>
    </main>
  )
}

export default Dashboard