# Domi: documento final

**Estructuras de Datos II**, Universidad Autónoma de Occidente
**Profesor:** Jonathan López Londoño
**Integrante:** Steban Mauricio Ramirez Velez

## 1. Alcance del proyecto

Domi es una aplicación web de delivery de comida para un solo restaurante. Permite que un cliente se registre, consulte el menú, arme un carrito, elija su zona de entrega, haga el pedido y lo siga en tiempo real, con un chat con el restaurante. Un administrador atiende los pedidos y gestiona el catálogo de platos.

**Incluido:**

- Registro e inicio de sesión reales, con roles de cliente y administrador.
- Menú público con búsqueda por prefijo, categorías y subcategorías, ventana de detalle del plato y fotos.
- Carrito con cantidades y deshacer, y barra flotante para avanzar con el pedido desde cualquier página.
- Zonas de entrega con mapa: ruta más corta desde el restaurante, distancia, tiempo y costo de envío.
- Pedidos guardados en base de datos con precios y envío calculados en el servidor, de forma transaccional.
- Seguimiento del estado del pedido y chat, ambos en tiempo real.
- Asistente automático que avisa al cliente cada vez que el administrador cambia el estado del pedido y responde preguntas sobre su pedido.
- Panel de administración: cola de pedidos, gestión de platos con subida de fotos y ranking de los platos más pedidos.
- Interfaz pública y privada, con rutas separadas para el cliente y el administrador.

**Fuera del alcance:** pagos en línea, varios restaurantes, seguimiento de un repartidor en el mapa y aplicación móvil nativa.

## 2. Tecnologías

| Capa | Tecnología | Para qué se usa |
|---|---|---|
| Interfaz | React y Vite | Componentes y compilación rápida |
| Rutas | React Router | Rutas públicas, de cliente y de administrador |
| Estado | Context API | Sesión del usuario y carrito |
| Estilos | SCSS Modules | Estilos por componente, sin choques de nombres |
| Backend | Supabase | Autenticación, PostgreSQL, Realtime y Storage |
| Seguridad | Row Level Security | Cada usuario solo ve y modifica lo suyo |
| Mapa | Leaflet y OpenStreetMap | Dibujo del mapa y las zonas |
| Publicación | Netlify | Alojamiento del frontend |
| Diseño | Figma | Propuesta gráfica |
| Control de versiones | Git y GitHub | Una rama por funcionalidad y Pull Requests |

**Base de datos.** Tablas: `profiles`, `categories`, `dishes`, `zones`, `zone_edges`, `orders`, `order_items` y `order_messages`. La función `create_order` registra un pedido completo en una sola transacción y calcula en el servidor los precios y el envío, de modo que el cliente no puede alterarlos. Los scripts para recrear todo están en la carpeta `supabase/`.

**Asistente.** Funciona con reglas: reconoce palabras clave en el mensaje del cliente y responde con los datos reales de su pedido. No usa un modelo de lenguaje. Es una decisión consciente para que su comportamiento sea predecible y gratuito.

## 3. Estructuras de datos y por qué

Se implementaron siete estructuras, todas en `src/dataStructures`, y todas se usan en la aplicación real. Cumplen la exigencia de dos de lista, pila o cola, dos de árbol, trie o montículo, y una de grafo.

### Pila (Stack)

- **Dónde:** botón "Deshacer" del carrito.
- **Por qué:** cada cambio en el carrito se guarda en la pila, y deshacer saca el último. El comportamiento "el último en entrar es el primero en salir" es exactamente lo que necesita un deshacer.

### Cola (Queue)

- **Dónde:** cola de pedidos del administrador.
- **Por qué:** los pedidos deben atenderse en el orden en que llegaron. "Atender siguiente" saca de la fila el pedido más antiguo y lo pasa a preparación. Es una cola FIFO, que garantiza justicia entre clientes.

### Trie

- **Dónde:** buscador del menú.
- **Por qué:** al escribir "piz" encuentra los platos que empiezan por ese prefijo sin recorrer todo el catálogo. El costo depende del largo del texto buscado, no de la cantidad de platos.

### Árbol de categorías

- **Dónde:** barra lateral de categorías del menú.
- **Por qué:** las categorías tienen jerarquía natural: "Platos fuertes" contiene "Carnes" y "Pollo". Un árbol representa esa relación y permite filtrar por una categoría padre incluyendo todos sus hijos.

### Montículo máximo (MaxHeap)

- **Dónde:** ranking de los platos más pedidos, en el inicio y en el panel de administración.
- **Por qué:** para mostrar los N platos con más pedidos basta con insertar todos y extraer N veces el máximo. Es más eficiente que ordenar toda la lista cuando N es pequeño.

### Grafo con algoritmo de Dijkstra

- **Dónde:** zonas de entrega. Las zonas son nodos y las conexiones tienen como peso los kilómetros.
- **Por qué:** calcular la ruta más corta entre el restaurante y la zona del cliente define la distancia, el tiempo estimado y el costo del envío. Un grafo ponderado es la representación natural de un mapa de calles. El servidor repite el cálculo al crear el pedido para que el cliente no pueda manipular el envío.

### Montículo mínimo (MinHeap)

- **Dónde:** cola de prioridad dentro de Dijkstra.
- **Por qué:** Dijkstra necesita extraer siempre el nodo con menor distancia acumulada. Un montículo mínimo hace esa extracción en tiempo logarítmico, en lugar de recorrer todos los nodos cada vez.

## 4. Diferencias entre la propuesta gráfica y el sitio final

La propuesta gráfica en Figma muestra las 11 pantallas del sitio. Estas son las diferencias:

- Las fotos de los platos son recuadros de color en la propuesta. En el sitio final son fotografías reales, tomadas de bancos de imágenes gratuitos.
- El fondo del sitio incluye un degradado suave con puntos decorativos, que la propuesta reduce a un color plano al convertirla a capas editables de Figma.
- La barra de navegación de la propuesta muestra el menú de un usuario con sesión iniciada. En el sitio, el menú cambia según el rol.
- El mapa de la propuesta es una representación esquemática. En el sitio final se dibuja con Leaflet y OpenStreetMap.
- El sitio añade la barra flotante del carrito, que acompaña el pedido en todas las páginas.

## 5. Decisiones y cambios durante el desarrollo

- Se reemplazó la librería de grafos por un dibujo propio con Leaflet, porque el mapa real aporta más información al cliente que un diagrama abstracto.
- La seguridad se resolvió en la base de datos y no en el frontend: las políticas de Row Level Security impiden que un cliente lea pedidos ajenos o escriba como administrador.
- Los avisos del asistente se generan con disparadores de la base de datos, de modo que llegan aunque el administrador cambie el estado desde cualquier pantalla.

## 6. Cómo probarlo

1. Abrir https://domi-delivery.netlify.app.
2. Crear una cuenta, agregar platos, usar "Deshacer" y finalizar el pedido eligiendo una zona.
3. Entrar a **Mis pedidos** y abrir el seguimiento y el chat.
4. Con una cuenta de administrador, atender el pedido desde **Administración › Pedidos** y ver cómo el cliente recibe los avisos sin recargar la página.