import { useState } from 'react'
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useDelivery } from '../../hooks/useDelivery'
import { formatearPrecio } from '../../helpers/format'
import styles from './Index.module.scss'

function Zones() {
  const { loading, error, zones, edges, origin, routes } = useDelivery()
  const [selectedId, setSelectedId] = useState('')

  if (loading) return <p className={styles.mensaje}>Cargando zonas...</p>
  if (error) return <p className={styles.mensaje}>{error}</p>
  if (!origin) return <p className={styles.mensaje}>No hay un restaurante configurado.</p>

  const posiciones = new Map(zones.map((z) => [z.id, [z.lat, z.lng]]))
  const nombres = new Map(zones.map((z) => [z.id, z.name]))
  const ruta = routes.get(selectedId)
  const lineaRuta = ruta ? ruta.camino.map((id) => posiciones.get(id)) : []
  const destinos = zones.filter((z) => !z.is_origin)

  return (
    <main className={styles.page}>
      <h1>Zonas de entrega</h1>
      <p className={styles.sub}>Elige tu zona y mira la ruta desde el restaurante, el tiempo y el costo del envío.</p>

      <div className={styles.contenido}>
        <section className={styles.mapa}>
          <MapContainer center={posiciones.get(origin.id)} zoom={12} scrollWheelZoom={false} className={styles.leaflet}>
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {edges.map((e) => (
              <Polyline
                key={`${e.zone_a}-${e.zone_b}`}
                positions={[posiciones.get(e.zone_a), posiciones.get(e.zone_b)]}
                pathOptions={{ color: '#B8A99A', weight: 3 }}
              />
            ))}

            {lineaRuta.length > 0 && (
              <Polyline positions={lineaRuta} pathOptions={{ color: '#E8590C', weight: 6 }} />
            )}

            {zones.map((z) => (
              <CircleMarker
                key={z.id}
                center={[z.lat, z.lng]}
                radius={z.is_origin || z.id === selectedId ? 11 : 8}
                pathOptions={{
                  color: '#fff',
                  weight: 2,
                  fillColor: z.is_origin ? '#2B1D14' : z.id === selectedId ? '#E8590C' : '#C2410C',
                  fillOpacity: 1,
                }}
                eventHandlers={{ click: () => !z.is_origin && setSelectedId(z.id) }}
              >
                <Tooltip>{z.is_origin ? `${z.name} (restaurante)` : z.name}</Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </section>

        <aside className={styles.panel}>
          <label htmlFor="zona">Tu zona</label>
          <select id="zona" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            <option value="">Elige una zona</option>
            {destinos.map((z) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>

          {ruta ? (
            <div className={styles.detalle}>
              <p className={styles.camino}>{ruta.camino.map((id) => nombres.get(id)).join(' → ')}</p>
              <div className={styles.fila}><span>Distancia</span><strong>{ruta.distancia.toFixed(1)} km</strong></div>
              <div className={styles.fila}><span>Tiempo estimado</span><strong>{ruta.minutos} min</strong></div>
              <div className={styles.fila}><span>Costo de envío</span><strong>{formatearPrecio(ruta.envio)}</strong></div>
            </div>
          ) : (
            <p className={styles.nota}>Selecciona una zona en la lista o toca un punto del mapa.</p>
          )}
        </aside>
      </div>

      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Zona</th>
            <th>Distancia</th>
            <th>Tiempo</th>
            <th>Envío</th>
          </tr>
        </thead>
        <tbody>
          {destinos.map((z) => {
            const r = routes.get(z.id)
            return (
              <tr key={z.id} onClick={() => setSelectedId(z.id)} className={z.id === selectedId ? styles.activa : ''}>
                <td>{z.name}</td>
                <td>{r ? `${r.distancia.toFixed(1)} km` : 'Sin cobertura'}</td>
                <td>{r ? `${r.minutos} min` : '-'}</td>
                <td>{r ? formatearPrecio(r.envio) : '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}

export default Zones