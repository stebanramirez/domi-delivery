import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMenu } from '../../hooks/useMenu'
import SearchBox from '../../components/Index/SearchBox/Index'
import CategoryMenu from '../../components/Index/CategoryMenu/Index'
import DishCard from '../../components/Index/DishCard/Index'
import styles from './Index.module.scss'

function Menu() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryId = searchParams.get('categoria')
  const [query, setQuery] = useState('')

  const { loading, error, tree, suggestions, filtered } = useMenu(query, categoryId)

  function elegirCategoria(id) {
    if (id) setSearchParams({ categoria: id })
    else setSearchParams({})
  }

  if (loading) return <p className={styles.mensaje}>Cargando menú...</p>
  if (error) return <p className={styles.mensaje}>{error}</p>

  return (
    <main className={styles.page}>
      <h1>Menú</h1>

      <SearchBox
        value={query}
        onChange={setQuery}
        suggestions={suggestions}
        onPick={(plato) => setQuery(plato.name)}
      />

      <div className={styles.contenido}>
        <aside className={styles.lateral}>
          <CategoryMenu tree={tree} selectedId={categoryId} onSelect={elegirCategoria} />
        </aside>

        <section className={styles.platos}>
          {filtered.length === 0 ? (
            <p className={styles.vacio}>No encontramos platos con esa búsqueda.</p>
          ) : (
            filtered.map((plato) => <DishCard key={plato.id} dish={plato} />)
          )}
        </section>
      </div>
    </main>
  )
}

export default Menu