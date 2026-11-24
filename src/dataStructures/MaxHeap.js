// Max-heap: árbol binario guardado en un arreglo donde cada padre es
// mayor o igual que sus hijos. La raíz (posición 0) siempre es el mayor.
// Para el nodo en la posición i:
//   padre  -> (i - 1) >> 1
//   hijos  -> 2i + 1  y  2i + 2
export default class MaxHeap {
  #items = []
  #clave

  // clave, dice por qué valor se compara cada elemento.
  // Ej: new MaxHeap((plato) => plato.times_ordered)
  constructor(clave = (x) => x) {
    this.#clave = clave
  }

  get size() {
    return this.#items.length
  }

  isEmpty() {
    return this.#items.length === 0
  }

  peek() {
    return this.#items[0] ?? null
  }

  // Agrega al final y lo sube hasta que su padre sea mayor. O(log n)
  insert(item) {
    this.#items.push(item)
    this.#subir(this.#items.length - 1)
  }

  // Quita y devuelve el mayor. Pone el último en la raíz y lo baja. O(log n)
  extractMax() {
    if (this.isEmpty()) return null
    const mayor = this.#items[0]
    const ultimo = this.#items.pop()
    if (this.#items.length > 0) {
      this.#items[0] = ultimo
      this.#bajar(0)
    }
    return mayor
  }

  #valor(i) {
    return this.#clave(this.#items[i])
  }

  #intercambiar(a, b) {
    ;[this.#items[a], this.#items[b]] = [this.#items[b], this.#items[a]]
  }

  #subir(i) {
    while (i > 0) {
      const padre = (i - 1) >> 1
      if (this.#valor(padre) >= this.#valor(i)) break
      this.#intercambiar(padre, i)
      i = padre
    }
  }

  #bajar(i) {
    const n = this.#items.length
    while (true) {
      const izq = 2 * i + 1
      const der = 2 * i + 2
      let mayor = i
      if (izq < n && this.#valor(izq) > this.#valor(mayor)) mayor = izq
      if (der < n && this.#valor(der) > this.#valor(mayor)) mayor = der
      if (mayor === i) break
      this.#intercambiar(i, mayor)
      i = mayor
    }
  }
}