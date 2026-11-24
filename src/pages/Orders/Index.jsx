import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyOrders } from '../../services/ordersService'
import { ESTADOS, formatearFecha } from '../../helpers/orders'
import { formatearPrecio } from '../../helpers/format'
import styles from './Index.module.scss'

function Orders() {
  const { session } = useAuth()
  const userId = session?.user?.id
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) return
    let cancelado = false

    getMyOrders(userId)
      .then((datos) => {
        if (!cancelado) setOrders(datos)
      })
      .catch(() => {
        if (!cancelado) setError('No se pudieron cargar tus pedidos.')
      })
      .finally(() => {
        if (!cancelado) setLoading(false)
      })

    return () => {
      cancelado = true
    }
  }, [userId])

  return (
    <main className={styles.page}>
      <h1>Mis pedidos</h1>

      {loading && <p className={styles.nota}>Cargando pedidos...</p>}
      {error && <p className={styles.nota}>{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className={styles.vacio}>
          <p className={styles.nota}>Aún no has hecho ningún pedido.</p>
          <Link to="/menu" className={styles.boton}>Ver el menú</Link>
        </div>
      )}

      {orders.map((o) => (
        <article key={o.id} className={styles.pedido}>
          <header className={styles.cabecera}>
            <div>
              <strong>Pedido #{o.id.slice(0, 8)}</strong>
              <span className={styles.fecha}>{formatearFecha(o.created_at)}</span>
            </div>
            <span className={`${styles.estado} ${styles[o.status]}`}>{ESTADOS[o.status]}</span>
          </header>

          <ul className={styles.items}>
            {o.order_items.map((i) => (
              <li key={i.id}>
                <span>{i.quantity} × {i.dish_name}</span>
                <span>{formatearPrecio(i.unit_price * i.quantity)}</span>
              </li>
            ))}
          </ul>

          <p className={styles.nota}>
            Entrega en {o.zones?.name} · {o.address}
          </p>

          <div className={styles.totales}>
            <span>Envío {formatearPrecio(o.shipping)}</span>
            <strong>Total {formatearPrecio(o.total)}</strong>
          </div>

          <Link to={`/pedidos/${o.id}`} className={styles.seguir}>Seguir pedido y chat</Link>
        </article>
      ))}
    </main>
  )
}

export default Orders