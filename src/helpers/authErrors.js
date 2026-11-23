export function traducirErrorAuth(mensaje = '') {
  if (mensaje.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos.'
  if (mensaje.includes('User already registered')) return 'Ese correo ya está registrado.'
  if (mensaje.includes('Password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.'
  if (mensaje.includes('Unable to validate email')) return 'El correo no es válido.'
  return 'Ocurrió un error. Intenta de nuevo.'
}