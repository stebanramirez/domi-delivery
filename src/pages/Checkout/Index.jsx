import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useDelivery } from '../../hooks/useDelivery'
import { createOrder } from '../../services/ordersService'
import { formatearPrecio } from '../../helpers/format'
import styles from './Index.module.scss'

// Lee un item del carrito sin depender de cómo se llamen sus campos
function normalizar(item) {
  return {
    dishId: item.id ?? item.dish_id ?? item.dishId,
    name: item.name,
    price: Number(item.price),
    quantity: Number(item.qty ?? item.quantity ?? item.cantidad ?? 1),
  }
}

function Checkout() {
  const { items, clear } = useCart()
  const { loading, error: errorZonas, zones, routes } = useDelivery()
  const navigate = useNavigate()

  const [zoneId, setZoneId] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const lineas = items.map(normalizar)
  const subtotal = lineas.reduce((suma, l) => suma + l.price * l.quantity, 0)
  const ruta = routes.get(zoneId)
  const envio = ruta ? ruta.envio : 0
  const destinos = zones.filter((z) => routes.has(z.id))

  if (lineas.length === 0) {
    return (
      <main className={styles.page}>
        <h1>Finalizar pedido</h1>
        <p className={styles.nota}>Tu carrito está vacío.</p>
        <Link to="/menu" className={styles.volver}>Ver el menú</Link>
      </main>
    )
  }

  async function enviarPedido(e) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await createOrder({
        zoneId,
        address,
        notes,
        items: lineas.map((l) => ({ dish_id: l.dishId, quantity: l.quantity })),
      })
      clear()
      navigate('/pedidos')
    } catch (err) {
      setError(err.message || 'No se pudo crear el pedido.')
      setEnviando(false)
    }
  }

  return (
    <main className={styles.page}>
      <h1>Finalizar pedido</h1>

      <div className={styles.contenido}>
        <form className={styles.form} onSubmit={enviarPedido}>
          <label htmlFor="zona">Zona de entrega</label>
          <select id="zona" value={zoneId} onChange={(e) => setZoneId(e.target.value)} required>
            <option value="">{loading ? 'Cargando zonas...' : 'Elige una zona'}</option>
            {destinos.map((z) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>

          <label htmlFor="direccion">Dirección</label>
          <input
            id="direccion"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Calle 5 # 38-20, apto 301"
            minLength={5}
            required
          />

          <label htmlFor="notas">Notas para el restaurante (opcional)</label>
          <textarea
            id="notas"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Sin cebolla, timbre dañado..."
          />

          {errorZonas && <p className={styles.error}>{errorZonas}</p>}
          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.boton} disabled={enviando || !zoneId}>
            {enviando ? 'Enviando...' : 'Confirmar pedido'}
          </button>
        </form>

        <aside className={styles.resumen}>
          <h2>Resumen</h2>
          <ul>
            {lineas.map((l) => (
              <li key={l.dishId}>
                <span>{l.quantity} × {l.name}</span>
                <span>{formatearPrecio(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className={styles.fila}><span>Subtotal</span><span>{formatearPrecio(subtotal)}</span></div>
          <div className={styles.fila}>
            <span>Envío{ruta ? ` (${ruta.distancia.toFixed(1)} km)` : ''}</span>
            <span>{ruta ? formatearPrecio(envio) : 'Elige una zona'}</span>
          </div>
          <div className={`${styles.fila} ${styles.total}`}>
            <span>Total</span>
            <span>{formatearPrecio(subtotal + envio)}</span>
          </div>
          {ruta && <p className={styles.nota}>Tiempo estimado: {ruta.minutos} min</p>}
          <p className={styles.nota}>El valor final lo confirma el servidor al crear el pedido.</p>
        </aside>
      </div>
    </main>
  )
}

export default Checkout