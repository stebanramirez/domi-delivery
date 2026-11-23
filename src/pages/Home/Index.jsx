import { useAuth } from '../../context/AuthContext'

function Home() {
  const { user, profile } = useAuth()

  return (
    <main style={{ padding: 40 }}>
      <h1>Domi</h1>
      <p>
        {user
          ? `Hola, ${profile?.full_name || user.email}. Tu rol es: ${profile?.role ?? '...'}`
          : 'Delivery de comida. Inicia sesión para pedir.'}
      </p>
    </main>
  )
}

export default Home