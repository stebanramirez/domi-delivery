import { useEffect, useMemo, useState } from 'react'
import { getDishes } from '../services/dishesService'
import { topN } from '../helpers/ranking'

// Pide los platos disponibles y devuelve los n más pedidos.
// El orden lo calcula el MaxHeap (helpers/ranking.js), no el .sort().
export default function useTopDishes(n = 5) {
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    getDishes()
      .then((data) => activo && setDishes(data))
      .catch((e) => activo && setError(e.message))
      .finally(() => activo && setLoading(false))
    // Si el componente se desmonta antes de que llegue la respuesta,
    // no actualizamos el estado.
    return () => {
      activo = false
    }
  }, [])

  // Solo se recalcula si cambian los platos o n.
  const top = useMemo(
    () => topN(dishes.filter((d) => (d.times_ordered ?? 0) > 0), n),
    [dishes, n]
  )

  return { top, loading, error }
}