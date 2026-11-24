import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'
import { formatearPrecio } from '../../../helpers/format'
import styles from './Index.module.scss'

// Páginas donde la barra no se muestra
const OCULTAR = ['/checkout', '/login']

function CartBar() {
  const { items, total } = useCart()
  const { pathname } = useLocation()

  // Suma las cantidades de todos los platos del carrito
  const cantidad = items.reduce(
    (n, item) => n + (item.quantity ?? item.qty ?? item.cantidad ?? 1),
    0
  )

  const oculta =
    cantidad === 0 ||
    OCULTAR.includes(pathname) ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/pedidos')

  if (oculta) return null

  // En el carrito el siguiente paso es pagar; en el resto, ir al carrito
  const enCarrito = pathname === '/carrito'
  const destino = enCarrito ? '/checkout' : '/carrito'
  const texto = enCarrito ? 'Continuar al pago' : 'Ver carrito y continuar'

  return (
    <>
      {/* Espacio para que la barra no tape el final de la página */}
      <div className={styles.espacio} />

      {/* key={cantidad}: al agregar un plato se vuelve a dibujar y repite la animación */}
      <Link to={destino} className={styles.barra} key={cantidad}>
        <span className={styles.resumen}>
          <strong>
            {cantidad} {cantidad === 1 ? 'plato' : 'platos'}
          </strong>
          <span>{formatearPrecio(total)}</span>
        </span>

        <span className={styles.accion}>
          {texto}
          <span className={styles.flecha}>→</span>
        </span>
      </Link>
    </>
  )
}

export default CartBar