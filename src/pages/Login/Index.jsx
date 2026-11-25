import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { traducirErrorAuth } from '../../helpers/authErrors'
import styles from './Index.module.scss'

function IconoOjo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconoOjoTachado() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.5 10.5 0 0 1 12 19c-6.4 0-10-7-10-7a18 18 0 0 1 4.06-5.06" />
      <path d="M9.9 5.1A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a18 18 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  )
}

function CampoClave({ id, minLength }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={styles.campoClave}>
      <input
        id={id}
        name="password"
        type={visible ? 'text' : 'password'}
        minLength={minLength}
        required
      />
      <button
        type="button"
        className={styles.verClave}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        aria-pressed={visible}
      >
        {visible ? <IconoOjoTachado /> : <IconoOjo />}
      </button>
    </div>
  )
}

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
          <CampoClave id="login-pass" />
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
          <CampoClave id="reg-pass" minLength={6} />
          {errorRegistro && <p className={styles.error}>{errorRegistro}</p>}
          {aviso && <p className={styles.aviso}>{aviso}</p>}
          <button type="submit" disabled={ocupado}>Crear cuenta</button>
        </form>
      </section>
    </main>
  )
}

export default Login