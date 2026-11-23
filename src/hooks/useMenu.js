import { useEffect, useMemo, useState } from 'react'
import { getCategories, getDishes } from '../services/dishesService'
import Trie from '../dataStructures/Trie'
import CategoryTree from '../dataStructures/CategoryTree'
import { palabras } from '../helpers/text'

export function useMenu(query, categoryId) {
  const [dishes, setDishes] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Cargar platos y categorías al mismo tiempo
  useEffect(() => {
    let cancelado = false

    Promise.all([getDishes(), getCategories()])
      .then(([platos, cats]) => {
        if (cancelado) return
        setDishes(platos)
        setCategories(cats)
      })
      .catch(() => {
        if (!cancelado) setError('No se pudo cargar el menú. Intenta de nuevo.')
      })
      .finally(() => {
        if (!cancelado) setLoading(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  // Estructuras de datos: se reconstruyen solo cuando cambian los datos
  const trie = useMemo(() => {
    const t = new Trie()
    for (const plato of dishes) {
      for (const palabra of palabras(plato.name)) t.insert(palabra, plato)
    }
    return t
  }, [dishes])

  const tree = useMemo(() => CategoryTree.fromList(categories), [categories])

  // Sugerencias del autocompletado: prefijo de la última palabra escrita
  const suggestions = useMemo(() => {
    const ultima = palabras(query).at(-1)
    if (!ultima) return []
    return trie.searchByPrefix(ultima, 5)
  }, [trie, query])

  // Platos a mostrar: filtro de búsqueda Trie y de categoría árbol
  const filtered = useMemo(() => {
    let resultado = dishes

    const palabrasBuscadas = palabras(query)
    if (palabrasBuscadas.length > 0) {
      const conjuntos = palabrasBuscadas.map(
        (p) => new Set(trie.searchByPrefix(p).map((d) => d.id))
      )
      resultado = resultado.filter((d) => conjuntos.every((c) => c.has(d.id)))
    }

    if (categoryId) {
      const ids = new Set(tree.descendantIds(categoryId))
      resultado = resultado.filter((d) => ids.has(d.category_id))
    }

    return resultado
  }, [dishes, trie, tree, query, categoryId])

  return { loading, error, tree, suggestions, filtered }
}