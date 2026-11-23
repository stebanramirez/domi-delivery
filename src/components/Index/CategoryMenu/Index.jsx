import styles from './Index.module.scss'

function CategoryItem({ nodo, selectedId, onSelect }) {
  const activo = nodo.id === selectedId

  return (
    <li>
      <button
        type="button"
        className={activo ? `${styles.item} ${styles.activo}` : styles.item}
        onClick={() => onSelect(nodo.id)}
      >
        {nodo.name}
      </button>
      {nodo.children.length > 0 && (
        <ul className={styles.sub}>
          {nodo.children.map((hijo) => (
            <CategoryItem key={hijo.id} nodo={hijo} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
  )
}

function CategoryMenu({ tree, selectedId, onSelect }) {
  return (
    <nav aria-label="Categorías">
      <h2 className={styles.titulo}>Categorías</h2>
      <ul className={styles.lista}>
        <li>
          <button
            type="button"
            className={!selectedId ? `${styles.item} ${styles.activo}` : styles.item}
            onClick={() => onSelect(null)}
          >
            Todos
          </button>
        </li>
        {tree.roots.map((raiz) => (
          <CategoryItem key={raiz.id} nodo={raiz} selectedId={selectedId} onSelect={onSelect} />
        ))}
      </ul>
    </nav>
  )
}

export default CategoryMenu