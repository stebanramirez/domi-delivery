import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main style={{ padding: 40 }}>
      <h1>404</h1>
      <p>Esta página no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </main>
  )
}

export default NotFound