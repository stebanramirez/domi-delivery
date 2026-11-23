import { createContext, useContext, useEffect, useState } from 'react'
import Stack from '../dataStructures/Stack'
import { addItem, cartCount, cartTotal, changeQty, removeItem } from '../helpers/cart'

const CartContext = createContext(null)
const CLAVE = 'domi-carrito'

function leerGuardado() {
  try {
    const crudo = localStorage.getItem(CLAVE)
    return crudo ? JSON.parse(crudo) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(leerGuardado)
  const [puedeDeshacer, setPuedeDeshacer] = useState(false)
  const [historial] = useState(() => new Stack())

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(items))
    } catch {
      // si el navegador no deja guardar, el carrito sigue funcionando en memoria
    }
  }, [items])

  // Cada cambio guarda el estado anterior en la pila
  function aplicar(nuevosItems) {
    historial.push(items)
    setItems(nuevosItems)
    setPuedeDeshacer(true)
  }

  function undo() {
    const anterior = historial.pop()
    if (anterior === undefined) return
    setItems(anterior)
    setPuedeDeshacer(!historial.isEmpty())
  }

  const value = {
    items,
    total: cartTotal(items),
    count: cartCount(items),
    puedeDeshacer,
    add: (plato) => aplicar(addItem(items, plato)),
    remove: (id) => aplicar(removeItem(items, id)),
    setQty: (id, qty) => aplicar(changeQty(items, id, qty)),
    clear: () => aplicar([]),
    undo,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}