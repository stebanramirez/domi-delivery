import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { formatearPrecio } from '../../../helpers/format'
import styles from './Index.module.scss'

function DishModal({ dish, onClose, onAdd }) {
  // Esc cierra la ventana y mientras está abierta la página de atrás no se mueve
  useEffect(() => {
    const alTeclear = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', alTeclear)
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', alTeclear)
      document.body.style.overflow = anterior
    }
  }, [onClose])

  const agregar = () => {
    onAdd(dish)
    onClose()
  }

  // createPortal dibuja la ventana directamente en body, fuera de la tarjeta,
  // para que el efecto de levantarse de la tarjeta no la desplace.
  return createPortal(
    <div className={styles.fondo} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={dish.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.cerrar}
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        <div className={styles.foto}>
          {dish.image_url ? (
            <>
              <img
                src={dish.image_url}
                alt=""
                aria-hidden="true"
                className={styles.difuminada}
              />
              <img
                src={dish.image_url}
                alt={dish.name}
                className={styles.principal}
              />
            </>
          ) : (
            <span className={styles.sinFoto}>Sin foto</span>
          )}
        </div>

        <div className={styles.info}>
          <h2>{dish.name}</h2>

          {dish.times_ordered > 0 && (
            <span className={styles.popular}>
              Pedido {dish.times_ordered} veces
            </span>
          )}

          <p className={styles.descripcion}>{dish.description}</p>

          <div className={styles.pie}>
            <span className={styles.precio}>{formatearPrecio(dish.price)}</span>
            <button type="button" className={styles.agregar} onClick={agregar}>
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default DishModal