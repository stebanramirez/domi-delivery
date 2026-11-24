import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminDishes } from '../../../hooks/useAdminDishes'
import DishForm from '../../../components/Index/DishForm/Index'
import { formatearPrecio } from '../../../helpers/format'
import styles from './Index.module.scss'

function AdminDishes() {
  const { loading, error, dishes, categories, guardar, alternar } = useAdminDishes()
  // null = formulario cerrado, 'nuevo' = crear, o el plato que se edita
  const [editando, setEditando] = useState(null)

  const nombresCategoria = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name ?? c.id])),
    [categories],
  )

  async function guardarYCerrar(datos) {
    await guardar(datos)
    setEditando(null)
  }

  if (loading) return <p className={styles.mensaje}>Cargando platos...</p>

  return (
    <main className={styles.page}>
      <Link to="/admin" className={styles.atras}>← Administración</Link>

      <header className={styles.encabezado}>
        <h1>Platos</h1>
        {!editando && (
          <button type="button" className={styles.nuevo} onClick={() => setEditando('nuevo')}>
            Nuevo plato
          </button>
        )}
      </header>

      {error && <p className={styles.error}>{error}</p>}

      {editando && (
        <DishForm
          key={editando === 'nuevo' ? 'nuevo' : editando.id}
          dish={editando === 'nuevo' ? null : editando}
          categories={categories}
          onSave={guardarYCerrar}
          onCancel={() => setEditando(null)}
        />
      )}

      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Plato</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Pedidos</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dishes.map((d) => (
            <tr key={d.id} className={d.available ? '' : styles.oculto}>
              <td className={styles.plato}>
                {d.image_url ? (
                  <img src={d.image_url} alt={d.name} />
                ) : (
                  <span className={styles.sinFoto}>Sin foto</span>
                )}
                <strong>{d.name}</strong>
              </td>
              <td>{nombresCategoria.get(d.category_id) ?? d.category_id}</td>
              <td>{formatearPrecio(d.price)}</td>
              <td>{d.times_ordered}</td>
              <td>
                <button type="button" className={styles.estado} onClick={() => alternar(d)}>
                  {d.available ? 'Visible' : 'Oculto'}
                </button>
              </td>
              <td>
                <button type="button" className={styles.editar} onClick={() => setEditando(d)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default AdminDishes