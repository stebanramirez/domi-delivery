export function addItem(items, plato) {
  const existe = items.some((i) => i.id === plato.id)
  if (existe) {
    return items.map((i) => (i.id === plato.id ? { ...i, qty: i.qty + 1 } : i))
  }
  return [...items, { id: plato.id, name: plato.name, price: plato.price, qty: 1 }]
}

export function removeItem(items, id) {
  return items.filter((i) => i.id !== id)
}

export function changeQty(items, id, qty) {
  if (qty <= 0) return removeItem(items, id)
  return items.map((i) => (i.id === id ? { ...i, qty } : i))
}

export function cartTotal(items) {
  return items.reduce((suma, i) => suma + i.price * i.qty, 0)
}

export function cartCount(items) {
  return items.reduce((suma, i) => suma + i.qty, 0)
}