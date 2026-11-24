# Domi: delivery de comida

Aplicación web de pedidos de comida a domicilio. Proyecto final de **Estructuras de Datos II**, Universidad Autónoma de Occidente. Profesor: Jonathan López Londoño.

## Integrante

| Nombre | GitHub |
|---|---|
| Steban Mauricio Ramirez Velez | [stebanramirez](https://github.com/stebanramirez) |

El proyecto se desarrolló de forma individual. Cada funcionalidad se trabajó en su propia rama (`feat/...`) y se unió a `main` mediante Pull Request. Las ramas se conservan en el repositorio.

## Enlaces

- **Sitio publicado (Netlify):** https://domi-delivery.netlify.app
- **Propuesta gráfica (Figma):** https://www.figma.com/design/HbpikJg0KiYn6tc6ZplPxf/propuesta-grafica?node-id=1-4&t=RWdTFVbHFnRl1hEx-1
  Para probar que las pantallas se pueden mover y editar, abre el enlace y usa **Duplicate to your drafts**.
- **Repositorio:** https://github.com/stebanramirez/domi-delivery
- **Documento final:** [docs/DOCUMENTO_FINAL.md](docs/DOCUMENTO_FINAL.md)

## Qué hace

- **Público:** inicio con los platos más pedidos, menú con búsqueda y categorías, detalle del plato y zonas de entrega con mapa.
- **Cliente (con sesión):** carrito con "Deshacer", pedido con zona de entrega y costo de envío, seguimiento del estado en tiempo real, chat con el restaurante y avisos automáticos del asistente.
- **Administrador:** cola de pedidos (en espera, en preparación, en camino y finalizados), gestión de platos con fotos y ranking de los platos más pedidos.

## Tecnologías

React y Vite, React Router, Context API, SCSS Modules, Supabase (autenticación, PostgreSQL, seguridad por filas, Realtime y Storage), Leaflet con OpenStreetMap y Netlify.

## Estructuras de datos

Todas están en `src/dataStructures` y se usan en la aplicación real. La justificación de cada una está en el [documento final](docs/DOCUMENTO_FINAL.md).

| Estructura | Dónde se usa |
|---|---|
| Pila (Stack) | Botón "Deshacer" del carrito |
| Cola (Queue) | Cola de pedidos del administrador ("Atender siguiente") |
| Trie | Búsqueda de platos por prefijo |
| Árbol de categorías | Categorías y subcategorías del menú |
| Montículo máximo (MaxHeap) | Ranking de los platos más pedidos |
| Grafo con Dijkstra | Ruta más corta entre el restaurante y las zonas de entrega |
| Montículo mínimo (MinHeap) | Cola de prioridad de Dijkstra |

## Estructura de carpetas

```
src/
  components/   Index/ (componentes de la app) y Shared/ (Navbar, Footer, Layout, CartBar)
  context/      AuthContext, CartContext
  dataStructures/
  helpers/
  hooks/
  pages/        una carpeta por página, con Index.jsx y Index.module.scss
  routes/       AppRoutes, UserRoutes, AdminRoutes
  services/     acceso a Supabase
  styles/
supabase/       scripts SQL (01 a 06) para recrear la base de datos
public/         _redirects para las rutas en Netlify
```

## Cómo ejecutarlo en local

```bash
git clone https://github.com/stebanramirez/domi-delivery.git
cd domi-delivery
npm install
cp .env.example .env     # en Windows: copy .env.example .env
npm run dev
```

Completa el archivo `.env` con los datos de tu proyecto de Supabase:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Para crear la base de datos en un proyecto nuevo de Supabase, ejecuta en el editor SQL los archivos de `supabase/` en orden, del `01` al `06`. Después hay que cargar las zonas de entrega, sus conexiones y las categorías, y asignar el rol de administrador a un usuario.

## Despliegue

El sitio se publica en Netlify desde la rama `main`. Cada push a `main` genera un nuevo despliegue. Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` se configuran en Netlify, y el archivo `public/_redirects` hace que las rutas de React Router funcionen al recargar la página.