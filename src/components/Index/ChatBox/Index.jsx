import { useEffect, useRef, useState } from 'react'
import styles from './Index.module.scss'

function autorDe(mensaje) {
  if (mensaje.is_bot) return 'Asistente Domi'
  if (mensaje.is_staff) return 'Restaurante'
  return 'Cliente'
}

function ChatBox({ messages, userId, onSend }) {
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const listaRef = useRef(null)

  // Baja al último mensaje cada vez que llega uno
  useEffect(() => {
    const lista = listaRef.current
    if (lista) lista.scrollTop = lista.scrollHeight
  }, [messages])

  async function enviar(e) {
    e.preventDefault()
    const limpio = texto.trim()
    if (!limpio) return
    setError('')
    setEnviando(true)
    try {
      await onSend(limpio)
      setTexto('')
    } catch {
      setError('No se pudo enviar el mensaje.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className={styles.chat}>
      <h2>Chat con el restaurante</h2>

      <div className={styles.lista} ref={listaRef}>
        {messages.length === 0 && (
          <p className={styles.vacio}>Escribe "hola" o pregunta por tu pedido.</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={!m.is_bot && m.sender_id === userId ? styles.mio : styles.otro}
          >
            <span className={styles.autor}>{autorDe(m)}</span>
            <p>{m.body}</p>
          </div>
        ))}
      </div>

      <form className={styles.form} onSubmit={enviar}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe un mensaje..."
          maxLength={500}
        />
        <button type="submit" disabled={enviando || !texto.trim()}>Enviar</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </section>
  )
}

export default ChatBox