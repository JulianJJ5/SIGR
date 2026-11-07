# SIGR · Sistema Integral de Gestión de Restaurante

Aplicación web para gestionar pedidos, reservas, administración del menú, facturación, control de caja y reportes de ventas de un restaurante. Esta versión (**v1.0.0**) es la **línea base** del proyecto: el primer punto estable sobre el que se controlarán los cambios futuros.

> Prototipo académico (curso Gestión del Software, Unidad 2). No está pensado para producción: los datos se guardan en el navegador y las contraseñas no se cifran.

## Módulos incluidos en la línea base

| Módulo | Qué hace | Archivos principales |
|---|---|---|
| Autenticación y usuarios | Inicio de sesión con tres roles (cliente, mesero, administrador), permisos por rol, alta y desactivación de usuarios | `src/services/auth.js`, `src/components/LoginForm.vue`, `src/views/UsuariosView.vue` |
| Menú digital | CRUD de categorías y platos, disponibilidad, armado del pedido | `src/services/menu.js`, `src/views/MenuView.vue` |
| Pedidos | Registro y seguimiento por estados (recibido → en preparación → listo → entregado), cancelación, actualización entre pestañas | `src/services/pedidos.js`, `src/views/PedidosView.vue` |
| Reservas | Reservas por fecha y hora con asignación automática de mesa y control de cruces | `src/services/reservas.js`, `src/views/ReservasView.vue` |
| Facturación | Factura de venta por pedido entregado, impuesto al consumo del 8 %, método de pago | `src/services/caja.js`, `src/views/PedidosView.vue` |
| Caja y reportes | Reporte diario de ventas, platos más vendidos, cierre de caja con arqueo de efectivo, exportación CSV | `src/services/caja.js`, `src/views/CajaView.vue` |

## Requisitos

- Node.js 18 o superior y npm.
- Un navegador moderno (Chrome, Edge o Firefox).

## Clonar y ejecutar

```bash
git clone https://github.com/JulianJJ5/SIGR.git
cd SIGR
git checkout v1.0.0        # línea base
npm install
npm run dev                # http://localhost:5173
```

Otros comandos:

```bash
npm test          # pruebas básicas de integración (node --test)
npm run build     # compilación de producción en dist/
npm run preview   # sirve la compilación de dist/
```

Versión publicada: https://julianjj5.github.io/SIGR/ (se actualiza sola en cada push a `main`).

## API REST (desde v1.2.0)

```bash
npm run api       # API en http://localhost:3200/api (y la página compilada en http://localhost:3200)
```

El menú y las reservas se guardan en la API con `fetch`; la dirección está en `API_URL` (`src/api.js`). Si la API no está corriendo, la página trabaja en modo local y lo indica arriba. Rutas, códigos y formato de errores: [server/README.md](server/README.md).

## Usuarios de demostración

| Rol | Usuario | Contraseña | Ve |
|---|---|---|---|
| Administrador | `admin` | `admin123` | Menú (CRUD), pedidos, reservas, caja y reportes, usuarios |
| Mesero | `mesero` | `mesero123` | Menú, pedidos (con mesa), reservas |
| Cliente | `cliente` | `cliente123` | Menú, sus pedidos, sus reservas |

La pantalla de inicio tiene un botón por rol para entrar directamente.

## Estructura de carpetas

```
sigr/
├── index.html               punto de entrada
├── package.json             dependencias y scripts
├── vite.config.js           configuración de Vite
├── src/
│   ├── main.js              arranque de Vue
│   ├── App.vue              barra, pestañas por rol y avisos
│   ├── store.js             estado global reactivo y persistencia
│   ├── styles.css           estilos
│   ├── db/                  seed.js (datos iniciales) y storage.js (localStorage)
│   ├── services/            lógica de negocio pura, sin Vue (auth, menu, pedidos, reservas, caja)
│   ├── components/          componentes reutilizables (LoginForm)
│   └── views/               una vista por módulo
├── tests/                   pruebas de integración de los servicios
└── docs/                    base de datos, manual de despliegue y acta de línea base
```

## Convenciones de código

- Nombres de variables, funciones y archivos en español, `camelCase` para funciones y `PascalCase` para componentes `.vue`.
- La lógica de negocio vive en `src/services/` como funciones puras que reciben la base de datos; las vistas solo llaman a esos servicios mediante `mutar()` de `src/store.js`.
- Ramas: `main` (estable), `develop` (integración) y `feature/<modulo>` para cada módulo.
- Mensajes de commit con prefijo: `feat:`, `fix:`, `docs:`, `test:`, `chore:`.

## Documentación

- [Estructura de la base de datos](docs/BASE_DE_DATOS.md)
- [Manual de despliegue](docs/MANUAL_DESPLIEGUE.md)
- [Acta de línea base](docs/LINEA_BASE.md)
- [Historial de cambios](CHANGELOG.md)
- [Créditos de las imágenes](docs/CREDITOS_IMAGENES.md)

## Licencia

MIT. Ver [LICENSE.txt](LICENSE.txt).
