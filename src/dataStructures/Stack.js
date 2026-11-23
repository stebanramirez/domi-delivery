class StackNode {
  constructor(valor, siguiente) {
    this.valor = valor
    this.siguiente = siguiente
  }
}

export default class Stack {
  constructor() {
    this.tope = null
    this.length = 0
  }

  push(valor) {
    this.tope = new StackNode(valor, this.tope)
    this.length++
  }

  pop() {
    if (!this.tope) return undefined
    const valor = this.tope.valor
    this.tope = this.tope.siguiente
    this.length--
    return valor
  }

  peek() {
    return this.tope ? this.tope.valor : undefined
  }

  isEmpty() {
    return this.length === 0
  }

  clear() {
    this.tope = null
    this.length = 0
  }
}