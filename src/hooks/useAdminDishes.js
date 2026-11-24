import { useCallback, useEffect, useState } from 'react'
import { createDish, getAllDishes, updateDish, uploadDishImage } from '../services/adminService'
import { getCategories } from '../services/dishesService'

export function useAdminDishes() {
  const [dishes, setDishes] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    try {
      const [platos, cats] = await Promise.all([getAllDishes(), getCategories()])
      setDishes(platos)
      setCategories(cats)
      setError('')
    } catch {
      setError('No se pudieron cargar los platos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  // Crea o edita un plato; si trae foto nueva, la sube primero
  const guardar = useCallback(
    async ({ id, archivo, ...campos }) => {
      const imageUrl = archivo ? await uploadDishImage(archivo) : campos.image_url
      const datos = { ...campos, image_url: imageUrl }
      if (id) {
        await updateDish(id, datos)
      } else {
        await createDish(datos)
      }
      await cargar()
    },
    [cargar],
  )

  // Oculta o muestra un plato en el menú
  const alternar = useCallback(
    async (dish) => {
      try {
        await updateDish(dish.id, { available: !dish.available })
      } catch {
        setError('No se pudo cambiar la disponibilidad.')
      }
      await cargar()
    },
    [cargar],
  )

  return { loading, error, dishes, categories, guardar, alternar }
}