import { useState } from 'react'
import styles from './Index.module.scss'

function SearchBox({ value, onChange, suggestions, onPick }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div className={styles.caja}>
      <input
        type="search"
        placeholder="Buscar un plato, por ejemplo: pizza"
        aria-label="Buscar plato"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setAbierto(true)}
        onBlur={() => setAbierto(false)}
      />
      {abierto && suggestions.length > 0 && (
        <ul className={styles.lista}>
          {suggestions.map((plato) => (
            <li
              key={plato.id}
              onMouseDown={(e) => {
                e.preventDefault()
                onPick(plato)
                setAbierto(false)
              }}
            >
              {plato.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBox