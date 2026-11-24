import { Link } from 'react-router-dom'
import styles from './Index.module.scss'

function Dashboard() {
  return (
    <main className={styles.page}>
      <h1>Administración</h1>
      <p className={styles.sub}>Gestiona los pedidos de Domi.</p>

      <div className={styles.grid}>
        <Link to="/admin/pedidos" className={styles.card}>
          <h2>Pedidos</h2>
          <p>Cola de espera, estados y chat con los clientes.</p>
        </Link>
      </div>
    </main>
  )
}

export default Dashboard