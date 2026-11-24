import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import useTopDishes from '../../hooks/useTopDishes'
import DishCard from '../../components/Index/DishCard/Index'
import styles from './Index.module.scss'

function Home() {
  const { user, profile } = useAuth()
  const { add } = useCart()
  // Los 4 platos con más pedidos, calculados con el MaxHeap
  const { top, loading, error } = useTopDishes(4)

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1>Domi</h1>
        <p>
          {user
            ? `Hola, ${profile?.full_name || user.email}. ¿Qué se te antoja hoy?`
            : 'Delivery de comida. Inicia sesión para pedir.'}
        </p>
        <div className={styles.acciones}>
          <Link to="/menu" className={styles.principal}>
            Ver el menú
          </Link>
          {!user && (
            <Link to="/login" className={styles.secundario}>
              Ingresar
            </Link>
          )}
        </div>
      </section>

      <section className={styles.top}>
        <h2>Los más pedidos</h2>

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