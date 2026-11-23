class TrieNode {
  constructor() {
    this.children = new Map()
    this.items = []
  }
}

export default class Trie {
  constructor() {
    this.root = new TrieNode()
  }

  insert(palabra, item) {
    let nodo = this.root
    for (const letra of palabra) {
      if (!nodo.children.has(letra)) nodo.children.set(letra, new TrieNode())
      nodo = nodo.children.get(letra)
    }
    nodo.items.push(item)
  }

  searchByPrefix(prefijo, limite = Infinity) {
    let nodo = this.root
    for (const letra of prefijo) {
      nodo = nodo.children.get(letra)
      if (!nodo) return []
    }
    const encontrados = new Map()
    this.#recolectar(nodo, encontrados, limite)
    return [...encontrados.values()]
  }

  #recolectar(nodo, encontrados, limite) {
    for (const item of nodo.items) {
      if (encontrados.size >= limite) return
      encontrados.set(item.id, item)
    }
    for (const hijo of nodo.children.values()) {
      if (encontrados.size >= limite) return
      this.#recolectar(hijo, encontrados, limite)
    }
  }
}