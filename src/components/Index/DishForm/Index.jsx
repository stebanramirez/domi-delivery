import { useState } from 'react'
import styles from './Index.module.scss'

function DishForm({ dish, categories, onSave, onCancel }) {
  const [name, setName] = useState(dish?.name ?? '')
  const [description, setDescription] = useState(dish?.description ?? '')
  const [price, setPrice] = useState(dish?.price ?? '')
  const [categoryId, setCategoryId] = useState(dish?.category_id ?? '')
  const [available, setAvailable] = useState(dish?.available ?? true)
  const [archivo, setArchivo] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function enviar(e) {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      await onSave({
        id: dish?.id,
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category_id: categoryId,
        available,
        image_url: dish?.image_url ?? null,
        archivo,
      })
    } catch (err) {
      setError(err.message || 'No se pudo guardar el plato.')
      setGuardando(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={enviar}>
      <h2>{dish ? 'Editar plato' : 'Nuevo plato'}</h2>

      <label htmlFor="nombre">Nombre</label>
      <input id="nombre" value={name} onChange={(e) => setName(e.target.value)} required />

      <label htmlFor="descripcion">Descripción</label>
      <textarea
        id="descripcion"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className={styles.fila}>
        <div>
          <label htmlFor="precio">Precio (COP)</label>
          <input
            id="precio"
            type="number"
            min="100"
            step="100"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Elige una categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name ?? c.id}</option>
            ))}
          </select>
        </div>
      </div>

      <label htmlFor="foto">Foto</label>
      {dish?.image_url && !archivo && (
        <img src={dish.image_url} alt={dish.name} className={styles.foto} />
      )}
      <input
        id="foto"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
      />

      <label className={styles.check}>
        <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
        Disponible en el menú
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.acciones}>
        <button type="submit" className={styles.guardar} disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" className={styles.cancelar} onClick={onCancel} disabled={guardando}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default DishForm