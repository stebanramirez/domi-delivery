import { Link } from 'react-router-dom'
import useTopDishes from '../../../hooks/useTopDishes'
import { formatearPrecio } from '../../../helpers/format'
import styles from './Index.module.scss'

function Dashboard() {
  const { top, loading, error } = useTopDishes(5)
  // El plato número 1 define el 100% de la barra.
  const maximo = top[0]?.times_ordered ?? 1

  return (
    <main className={styles.page}>
      <h1>Administración</h1>

      <div className={styles.accesos}>
        <Link to="/admin/pedidos" className={styles.acceso}>
          <h2>Pedidos</h2>
          <p>Cola de espera, preparación y entrega en tiempo real.</p>
        </Link>
        <Link to="/admin/platos" className={styles.acceso}>
          <h2>Platos</h2>
          <p>Crear, editar, ocultar y subir fotos.</p>
        </Link>
      </div>

      <section className={styles.top}>
        <h2>Top 5 platos más pedidos</h2>

        {loading && <p className={styles.nota}>Cargando…</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && top.length === 0 && (
          <p className={styles.nota}>Aún no hay platos pedidos.</p>
        )}

        <ol className={styles.lista}>
          {top.map((plato, i) => (
            <li key={plato.id} className={styles.fila}>
              <span className={styles.puesto}>{i + 1}</span>
              <div className={styles.info}>
                <div className={styles.linea}>
                  <strong>{plato.name}</strong>
                  <span>
                    {plato.times_ordered} pedidos · {formatearPrecio(plato.price)}
                  </span>
                </div>
                <div className={styles.barra}>
                  <div
                    className={styles.relleno}
                    style={{ width: `${(plato.times_ordered / maximo) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}

export default Dashboard