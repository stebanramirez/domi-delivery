import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { traducirErrorAuth } from '../../helpers/authErrors'
import styles from './Index.module.scss'

function Login() {
  const { user, signIn, signUp } = useAuth()
  const location = useLocation()
  const destino = location.state?.from?.pathname || '/'

  const [errorLogin, setErrorLogin] = useState('')
  const [errorRegistro, setErrorRegistro] = useState('')
  const [aviso, setAviso] = useState('')
  const [ocupado, setOcupado] = useState(false)

  if (user) return <Navigate to={destino} replace />

  async function handleLogin(e) {
    e.preventDefault()
    const datos = new FormData(e.currentTarget)
    setOcupado(true)
    setErrorLogin('')
    try {
      await signIn(datos.get('email'), datos.get('password'))
    } catch (err) {
      setErrorLogin(traducirErrorAuth(err.message))
    } finally {
      setOcupado(false)
    }
  }

  async function handleRegistro(e) {
    e.preventDefault()
    const datos = new FormData(e.currentTarget)
    setOcupado(true)
    setErrorRegistro('')
    setAviso('')
    try {
      const res = await signUp(datos.get('email'), datos.get('password'), datos.get('nombre'))
      if (!res.session) setAviso('Cuenta creada. Revisa tu correo para confirmarla.')
    } catch (err) {
      setErrorRegistro(traducirErrorAuth(err.message))
    } finally {
      setOcupado(false)
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <label htmlFor="login-email">Correo</label>
          <input id="login-email" name="email" type="email" required />
          <label htmlFor="login-pass">Contraseña</label>
          <input id="login-pass" name="password" type="password" required />
          {errorLogin && <p className={styles.error}>{errorLogin}</p>}
          <button type="submit" disabled={ocupado}>Entrar</button>
        </form>
      </section>

      <section className={styles.card}>
        <h2>Crear cuenta</h2>
        <form onSubmit={handleRegistro} className={styles.form}>
          <label htmlFor="reg-nombre">Nombre completo</label>
          <input id="reg-nombre" name="nombre" type="text" required />
          <label htmlFor="reg-email">Correo</label>
          <input id="reg-email" name="email" type="email" required />
          <label htmlFor="reg-pass">Contraseña (mínimo 6 caracteres)</label>
          <input id="reg-pass" name="password" type="password" minLength={6} required />
          {errorRegistro && <p className={styles.error}>{errorRegistro}</p>}
          {aviso && <p className={styles.aviso}>{aviso}</p>}
          <button type="submit" disabled={ocupado}>Crear cuenta</button>
        </form>
      </section>
    </main>
  )
}

export default Login