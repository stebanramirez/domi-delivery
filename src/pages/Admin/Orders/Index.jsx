import { useAdminOrders } from '../../../hooks/useAdminOrders'
import OrderCard from '../../../components/Index/OrderCard/Index'
import styles from './Index.module.scss'

function Seccion({ titulo, pedidos, vacio, onAvanzar, onCancelar, conPosicion }) {
  return (
    <section className={styles.seccion}>
      <h2>
        {titulo} <span className={styles.conteo}>{pedidos.length}</span>
      </h2>
      {pedidos.length === 0 ? (
        <p className={styles.vacio}>{vacio}</p>
      ) : (
        <div className={styles.grid}>
          {pedidos.map((p, i) => (
            <OrderCard
              key={p.id}
              order={p}
              etiqueta={conPosicion ? (i === 0 ? 'Siguiente' : `Turno ${i + 1}`) : undefined}
              onAvanzar={onAvanzar}
              onCancelar={onCancelar}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function AdminOrders() {
  const {
    loading,
    error,
    enCola,
    preparando,
    enCamino,
    finalizados,
    atenderSiguiente,
    avanzar,
    cancelar,
  } = useAdminOrders()

  function pedirCancelar(order) {
    if (window.confirm(`¿Cancelar el pedido #${order.id.slice(0, 8)}?`)) cancelar(order)
  }

  if (loading) return <p className={styles.mensaje}>Cargando pedidos...</p>

  return (
    <main className={styles.page}>
      <header className={styles.encabezado}>
        <div>
          <h1>Pedidos</h1>
          <p className={styles.sub}>Los pedidos nuevos entran solos a la cola, sin recargar.</p>
        </div>
        <button
          type="button"
          className={styles.atender}
          onClick={atenderSiguiente}
          disabled={enCola.length === 0}
        >
          Atender siguiente
        </button>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      <Seccion
        titulo="Cola de espera"
        pedidos={enCola}
        vacio="No hay pedidos esperando."
        onAvanzar={avanzar}
        onCancelar={pedirCancelar}
        conPosicion
      />
      <Seccion
        titulo="En preparación"
        pedidos={preparando}
        vacio="Nada en preparación."
        onAvanzar={avanzar}
        onCancelar={pedirCancelar}
      />
      <Seccion
        titulo="En camino"
        pedidos={enCamino}
        vacio="Ningún pedido en camino."
        onAvanzar={avanzar}
        onCancelar={pedirCancelar}
      />
      <Seccion
        titulo="Finalizados"
        pedidos={finalizados}
        vacio="Aún no hay pedidos finalizados."
        onAvanzar={avanzar}
        onCancelar={pedirCancelar}
      />
    </main>
  )
}

export default AdminOrders