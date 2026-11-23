export default class MinHeap {
  constructor(comparar = (a, b) => a - b) {
    this.datos = []
    this.comparar = comparar
  }

  get size() {
    return this.datos.length
  }

  isEmpty() {
    return this.datos.length === 0
  }

  peek() {
    return this.datos[0]
  }

  push(valor) {
    this.datos.push(valor)
    this.#subir(this.datos.length - 1)
  }

  pop() {
    if (this.isEmpty()) return undefined
    const raiz = this.datos[0]
    const ultimo = this.datos.pop()
    if (this.datos.length > 0) {
      this.datos[0] = ultimo
      this.#bajar(0)
    }
    return raiz
  }

  #subir(i) {
    while (i > 0) {
      const padre = Math.floor((i - 1) / 2)
      if (this.comparar(this.datos[i], this.datos[padre]) >= 0) break
      this.#intercambiar(i, padre)
      i = padre
    }
  }

  #bajar(i) {
    const n = this.datos.length
    while (true) {
      const izq = 2 * i + 1
      const der = 2 * i + 2
      let menor = i
      if (izq < n && this.comparar(this.datos[izq], this.datos[menor]) < 0) menor = izq
      if (der < n && this.comparar(this.datos[der], this.datos[menor]) < 0) menor = der
      if (menor === i) break
      this.#intercambiar(i, menor)
      i = menor
    }
  }

  #intercambiar(a, b) {
    const temporal = this.datos[a]
    this.datos[a] = this.datos[b]
    this.datos[b] = temporal
  }
}