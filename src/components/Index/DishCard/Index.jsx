import { useState } from 'react'
import { formatearPrecio } from '../../../helpers/format'
import DishModal from '../DishModal/Index'
import styles from './Index.module.scss'

function DishCard({ dish, onAdd }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <>
      <article className={styles.card}>
        {/* La foto es un botón: al hacer clic se abre el detalle */}
        <button
          type="button"
          className={styles.foto}
          onClick={() => setAbierto(true)}
          aria-label={`Ver detalle de ${dish.name}`}
        >
          {dish.image_url ? (
            <>
              <img
                src={dish.image_url}
                alt=""
                aria-hidden="true"
                className={styles.fondo}
              />
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
          <span className={styles.ver}>Ver detalle</span>
        </button>

        <div className={styles.cuerpo}>
          <h3 className={styles.nombre}>
            <button
              type="button"
              className={styles.nombreBtn}
              onClick={() => setAbierto(true)}
            >
              {dish.name}
            </button>
          </h3>
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

      {abierto && (
        <DishModal
          dish={dish}
          onClose={() => setAbierto(false)}
          onAdd={onAdd}
        />
      )}
    </>
  )
}

export default DishCard