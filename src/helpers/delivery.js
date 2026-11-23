// Costo: base de $3.000 más $1.000 por km, redondeado hacia arriba a $500
export function calcularEnvio(km) {
  return Math.ceil((3000 + km * 1000) / 500) * 500
}

// Tiempo: 15 minutos de preparación más 2,5 minutos por km
export function calcularMinutos(km) {
  return Math.round(15 + km * 2.5)
}