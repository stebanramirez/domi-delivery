import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useOrderTracking } from '../../hooks/useOrderTracking'
import ChatBox from '../../components/Index/ChatBox/Index'
import { ESTADOS, FLUJO, formatearFecha } from '../../helpers/orders'
import { formatearPrecio } from '../../helpers/format'
import styles from './Index.module.scss'

function Tracking() {
  const { id } = useParams()
  const { session } = useAuth()
  const { loading, error, order, messages, send } = useOrderTracking(id)

  if (loading) return <p className={styles.mensaje}>Cargando pedido...</p>
  if (error || !order) {
    return (
      <main className={styles.page}>
        <p className={styles.mensaje}>{error || 'No encontramos este pedido.'}</p>
        <Link to="/pedidos" className={styles.volver}>Volver a mis pedidos</Link>
      </main>
    )
  }

  const actual = FLUJO.indexOf(order.status)

  return (
    <main className={styles.page}>
      <Link to="/pedidos" className={styles.atras}>← Mis pedidos</Link>
      <h1>Pedido #{order.id.slice(0, 8)}</h1>
      <p className={styles.sub}>{formatearFecha(order.created_at)} · Entrega en {order.zones?.name}</p>

      <section className={styles.tarjeta}>
        {order.status === 'cancelado' ? (
          <p className={styles.cancelado}>Este pedido fue cancelado.</p>
        ) : (
          <ol className={styles.pasos}>
            {FLUJO.map((estado, i) => (
              <li key={estado} className={i <= actual ? styles.hecho : ''}>
                <span className={styles.punto} />
                {ESTADOS[estado]}
              </li>
            ))}
          </ol>
        )}
        <p className={styles.nota}>El estado se actualiza solo, sin recargar la página.</p>
      </section>

      <div className={styles.contenido}>
        <section className={styles.tarjeta}>
          <h2>Resumen</h2>
          <ul className={styles.items}>
            {order.order_items.map((i) => (
              <li key={i.id}>
                <span>{i.quantity} × {i.dish_name}</span>
                <span>{formatearPrecio(i.unit_price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.fila}><span>Envío</span><span>{formatearPrecio(order.shipping)}</span></div>
          <div className={`${styles.fila} ${styles.total}`}>
            <span>Total</span>
            <span>{formatearPrecio(order.total)}</span>
          </div>
          <p className={styles.nota}>{order.address}</p>
        </section>

        <ChatBox messages={messages} userId={session?.user?.id} onSend={send} />
      </div>
    </main>
  )
}

export default Tracking