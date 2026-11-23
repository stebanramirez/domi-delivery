class CategoryNode {
  constructor(datos) {
    this.id = datos.id
    this.name = datos.name
    this.children = []
  }
}

export default class CategoryTree {
  constructor() {
    this.roots = []
    this.index = new Map()
  }

  static fromList(lista) {
    const arbol = new CategoryTree()
    for (const c of lista) arbol.index.set(c.id, new CategoryNode(c))
    for (const c of lista) {
      const nodo = arbol.index.get(c.id)
      const padre = c.parent_id ? arbol.index.get(c.parent_id) : null
      if (padre) padre.children.push(nodo)
      else arbol.roots.push(nodo)
    }
    return arbol
  }

  find(id) {
    return this.index.get(id) ?? null
  }

  descendantIds(id) {
    const inicio = this.find(id)
    if (!inicio) return []
    const ids = []
    const pila = [inicio]
    while (pila.length > 0) {
      const nodo = pila.pop()
      ids.push(nodo.id)
      pila.push(...nodo.children)
    }
    return ids
  }
}