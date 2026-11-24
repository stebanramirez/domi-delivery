import { Link } from 'react-router-dom'
import { ESTADOS, formatearFecha } from '../../../helpers/orders'
import { formatearPrecio } from '../../../helpers/format'
import styles from './Index.module.scss'

const ACCION = {
  recibido: 'Empezar a preparar',
  preparando: 'Enviar pedido',
  en_camino: 'Marcar entregado',
}

function OrderCard({ order, etiqueta, onAvanzar, onCancelar }) {
  const activo = Boolean(ACCION[order.status])

  return (
    <article className={styles.card}>
      <header className={styles.cabecera}>
        <div>
          <strong>#{order.id.slice(0, 8)}</strong>
          <span className={styles.meta}>{formatearFecha(order.created_at)}</span>
        </div>
        {etiqueta ? (
          <span className={styles.etiqueta}>{etiqueta}</span>
        ) : (
          <span className={`${styles.estado} ${styles[order.status]}`}>{ESTADOS[order.status]}</span>
        )}
      </header>

      <p className={styles.cliente}>
        {order.cliente} · {order.zones?.name}
      </p>

      <ul className={styles.items}>
        {order.order_items.map((i) => (
          <li key={i.id}>
            {i.quantity} × {i.dish_name}
          </li>
        ))}
      </ul>

      <p className={styles.total}>Total {formatearPrecio(order.total)}</p>

      <div className={styles.acciones}>
        {activo && (
          <button type="button" className={styles.primario} onClick={() => onAvanzar(order)}>
            {ACCION[order.status]}
          </button>
        )}
        <Link to={`/pedidos/${order.id}`} className={styles.secundario}>Chat</Link>
        {activo && (
          <button type="button" className={styles.peligro} onClick={() => onCancelar(order)}>
            Cancelar
          </button>
        )}
      </div>
    </article>
  )
}

export default OrderCard