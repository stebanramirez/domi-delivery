export function normalizar(texto = '') {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export function palabras(texto = '') {
  return normalizar(texto).split(/\s+/).filter(Boolean)
}