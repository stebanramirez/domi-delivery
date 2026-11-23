import { formatearPrecio } from '../../../helpers/format'
import styles from './Index.module.scss'

function DishCard({ dish, onAdd }) {
  return (
    <article className={styles.card}>
      {dish.image_url ? (
        <img className={styles.foto} src={dish.image_url} alt={dish.name} />
      ) : (
        <div className={styles.foto} aria-hidden="true">Foto</div>
      )}
      <div className={styles.info}>
        <h3>{dish.name}</h3>
        <p className={styles.descripcion}>{dish.description}</p>
        <div className={styles.pie}>
          <strong className={styles.precio}>{formatearPrecio(dish.price)}</strong>
          {onAdd && (
            <button type="button" onClick={() => onAdd(dish)}>Agregar</button>
          )}
        </div>
      </div>
    </article>
  )
}

export default DishCard