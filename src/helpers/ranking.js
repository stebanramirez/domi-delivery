import MaxHeap from '../dataStructures/MaxHeap'

// Devuelve los n elementos con mayor valor de clave.
// Metemos todo al max-heap y extraemos el mayor n veces.
export function topN(lista, n, clave = (plato) => plato.times_ordered ?? 0) {
  const heap = new MaxHeap(clave)
  lista.forEach((item) => heap.insert(item))

  const resultado = []
  while (resultado.length < n && !heap.isEmpty()) {
    resultado.push(heap.extractMax())
  }
  return resultado
}