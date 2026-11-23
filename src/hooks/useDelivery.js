import { useEffect, useMemo, useState } from 'react'
import { getZoneEdges, getZones } from '../services/zonesService'
import Graph from '../dataStructures/Graph'
import { calcularEnvio, calcularMinutos } from '../helpers/delivery'

export function useDelivery() {
  const [zones, setZones] = useState([])
  const [edges, setEdges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelado = false

    Promise.all([getZones(), getZoneEdges()])
      .then(([zonas, conexiones]) => {
        if (cancelado) return
        setZones(zonas)
        setEdges(conexiones)
      })
      .catch(() => {
        if (!cancelado) setError('No se pudieron cargar las zonas de entrega.')
      })
      .finally(() => {
        if (!cancelado) setLoading(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  // El grafo: zonas como nodos y distancias como conexiones con peso
  const graph = useMemo(() => {
    const g = new Graph()
    for (const zona of zones) g.addNode(zona.id, zona)
    for (const conexion of edges) {
      g.addEdge(conexion.zone_a, conexion.zone_b, Number(conexion.distance_km))
    }
    return g
  }, [zones, edges])

  const origin = useMemo(() => zones.find((z) => z.is_origin) ?? null, [zones])

  // Ruta más corta desde el restaurante hacia cada zona
  const routes = useMemo(() => {
    const rutas = new Map()
    if (!origin) return rutas
    for (const zona of zones) {
      if (zona.id === origin.id) continue
      const ruta = graph.shortestPath(origin.id, zona.id)
      if (ruta) {
        rutas.set(zona.id, {
          ...ruta,
          envio: calcularEnvio(ruta.distancia),
          minutos: calcularMinutos(ruta.distancia),
        })
      }
    }
    return rutas
  }, [graph, zones, origin])

  return { loading, error, zones, edges, origin, routes }
}