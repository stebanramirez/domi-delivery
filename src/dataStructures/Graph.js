import MinHeap from './MinHeap'

export default class Graph {
  constructor() {
    this.nodes = new Map()
    this.adjacency = new Map()
  }

  addNode(id, datos = {}) {
    this.nodes.set(id, { id, ...datos })
    if (!this.adjacency.has(id)) this.adjacency.set(id, [])
  }

  addEdge(a, b, peso) {
    if (!this.nodes.has(a) || !this.nodes.has(b)) return
    this.adjacency.get(a).push({ to: b, peso })
    this.adjacency.get(b).push({ to: a, peso })
  }

  // Camino más corto con Dijkstra, usando un heap como cola de prioridad
  shortestPath(origen, destino) {
    if (!this.nodes.has(origen) || !this.nodes.has(destino)) return null

    const distancias = new Map()
    const anterior = new Map()
    for (const id of this.nodes.keys()) distancias.set(id, Infinity)
    distancias.set(origen, 0)

    const cola = new MinHeap((a, b) => a.distancia - b.distancia)
    cola.push({ id: origen, distancia: 0 })

    while (!cola.isEmpty()) {
      const { id, distancia } = cola.pop()
      if (distancia > distancias.get(id)) continue
      if (id === destino) break

      for (const { to, peso } of this.adjacency.get(id)) {
        const nueva = distancia + peso
        if (nueva < distancias.get(to)) {
          distancias.set(to, nueva)
          anterior.set(to, id)
          cola.push({ id: to, distancia: nueva })
        }
      }
    }

    if (distancias.get(destino) === Infinity) return null

    const camino = []
    for (let actual = destino; actual !== undefined; actual = anterior.get(actual)) {
      camino.unshift(actual)
    }
    return { distancia: distancias.get(destino), camino }
  }
}