import { formatearPrecio } from '../../../helpers/format'
import styles from './Index.module.scss'

function DishCard({ dish, onAdd }) {
  return (
    <article className={styles.card}>
      <div className={styles.foto}>
        {dish.image_url ? (
          <>
            {/* Copia desenfocada que rellena el fondo del recuadro */}
            <img
              src={dish.image_url}
              alt=""
              aria-hidden="true"
              className={styles.fondo}
            />
            {/* Foto real, siempre completa */}
            <img
              src={dish.image_url}
              alt={dish.name}
              loading="lazy"
              className={styles.principal}
            />
          </>
        ) : (
          <span className={styles.sinFoto}>Foto</span>
        )}
      </div>

      <div className={styles.cuerpo}>
        <h3 className={styles.nombre}>{dish.name}</h3>
        <p className={styles.descripcion}>{dish.description}</p>

        <div className={styles.pie}>
          <span className={styles.precio}>{formatearPrecio(dish.price)}</span>
          <button
            type="button"
            className={styles.agregar}
            onClick={() => onAdd(dish)}
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  )
}

export default DishCard