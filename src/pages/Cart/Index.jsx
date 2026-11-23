import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { formatearPrecio } from '../../helpers/format'
import styles from './Index.module.scss'

function Cart() {
  const { items, total, puedeDeshacer, setQty, remove, clear, undo } = useCart()

  if (items.length === 0) {
    return (
      <main className={styles.page}>
        <h1>Carrito</h1>
        <div className={styles.vacio}>
          <p>Tu carrito está vacío.</p>
          <Link to="/menu" className={styles.principal}>Ver el menú</Link>
          {puedeDeshacer && (
            <button type="button" className={styles.secundario} onClick={undo}>
              Deshacer
            </button>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.cabecera}>
        <h1>Carrito</h1>
        <div className={styles.acciones}>
          <button type="button" className={styles.secundario} onClick={undo} disabled={!puedeDeshacer}>
            Deshacer
          </button>
          <button type="button" className={styles.secundario} onClick={clear}>
            Vaciar carrito
          </button>
        </div>
      </div>

      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Plato</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th><span className={styles.oculto}>Quitar</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{formatearPrecio(item.price)}</td>
              <td>
                <div className={styles.cantidad}>
                  <button type="button" aria-label={`Quitar uno de ${item.name}`} onClick={() => setQty(item.id, item.qty - 1)}>-</button>
                  <span>{item.qty}</span>
                  <button type="button" aria-label={`Agregar uno de ${item.name}`} onClick={() => setQty(item.id, item.qty + 1)}>+</button>
                </div>
              </td>
              <td>{formatearPrecio(item.price * item.qty)}</td>
              <td>
                <button type="button" className={styles.quitar} onClick={() => remove(item.id)}>
                  Quitar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.resumen}>
        <div className={styles.fila}>
          <span>Subtotal</span>
          <strong>{formatearPrecio(total)}</strong>
        </div>
        <p className={styles.nota}>El costo de envío se calcula según tu zona de entrega.</p>
      </div>
    </main>
  )
}

export default Cart