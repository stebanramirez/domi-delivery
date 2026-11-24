class Nodo {
  constructor(valor) {
    this.valor = valor
    this.siguiente = null
  }
}

// Cola FIFO: el primero en entrar es el primero en salir.
// Se guarda como lista enlazada con puntero al frente y al final.
export default class Queue {
  constructor() {
    this.frente = null
    this.final = null
    this.longitud = 0
  }

  get size() {
    return this.longitud
  }

  isEmpty() {
    return this.longitud === 0
  }

  enqueue(valor) {
    const nodo = new Nodo(valor)
    if (this.final) {
      this.final.siguiente = nodo
    } else {
      this.frente = nodo
    }
    this.final = nodo
    this.longitud += 1
  }

  dequeue() {
    if (!this.frente) return undefined
    const nodo = this.frente
    this.frente = nodo.siguiente
    if (!this.frente) this.final = null
    this.longitud -= 1
    return nodo.valor
  }

  peek() {
    return this.frente ? this.frente.valor : undefined
  }

  toArray() {
    const lista = []
    for (let nodo = this.frente; nodo; nodo = nodo.siguiente) lista.push(nodo.valor)
    return lista
  }
}