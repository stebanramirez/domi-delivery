import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import useTopDishes from '../../hooks/useTopDishes'
import DishCard from '../../components/Index/DishCard/Index'
import styles from './Index.module.scss'

function Home() {
  const { user, profile } = useAuth()
  const { add } = useCart()
  // El primero del top se usa en el banner y los 4 primeros en la lista
  const { top, loading, error } = useTopDishes(4)
  const estrella = top[0]

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.textos}>
          <span className={styles.etiqueta}>Delivery en Cali</span>

          <h1>
            Tu comida favorita, <span>a la puerta</span> de tu casa
          </h1>

          <p className={styles.saludo}>
            {user
              ? `Hola, ${profile?.full_name || user.email}. ¿Qué se te antoja hoy?`
              : 'Pide en pocos minutos. Inicia sesión para hacer tu pedido.'}
          </p>

          <div className={styles.acciones}>
            <Link to="/menu" className={styles.principal}>
              Ver el menú
            </Link>
            {user ? (
              <Link to="/pedidos" className={styles.secundario}>
                Mis pedidos
              </Link>
            ) : (
              <Link to="/login" className={styles.secundario}>
                Ingresar
              </Link>
            )}
          </div>

          <ul className={styles.datos}>
            <li>Seguimiento en tiempo real</li>
            <li>Chat con el restaurante</li>
            <li>Envío según tu zona</li>
          </ul>
        </div>

        {estrella?.image_url && (
          <div className={styles.imagen}>
            <img src={estrella.image_url} alt={estrella.name} />
            <span className={styles.sello}>El más pedido · {estrella.name}</span>
          </div>
        )}
      </section>

      <section className={styles.top}>
        <div className={styles.encabezado}>
          <h2>Los más pedidos</h2>
          <Link to="/menu">Ver todo el menú →</Link>
        </div>

        {loading && <p className={styles.nota}>Cargando…</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && top.length === 0 && (
          <p className={styles.nota}>Aún no hay platos pedidos.</p>
        )}

        <div className={styles.grid}>
          {top.map((plato) => (
            <DishCard key={plato.id} dish={plato} onAdd={add} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home