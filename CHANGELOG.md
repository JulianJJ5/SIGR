# Historial de cambios

Todos los cambios relevantes del proyecto se registran en este archivo.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el versionado sigue [Versionado Semántico](https://semver.org/lang/es/).

## [Sin publicar]

Los cambios posteriores a la línea base se registran aquí y se controlan mediante solicitudes de cambio (GitHub Issues) y ramas `feature/` o `fix/` que se integran por `develop`.

## [1.1.1] - 2026-11-07

### Corregido
- Pantalla en blanco en GitHub Pages: Pages servía el código fuente sin compilar. Se agregó el flujo `.github/workflows/pages.yml`, que compila y publica `dist/`.
- Las rutas de la app y de las imágenes son relativas (`base: "./"` y `rutaImagen()`), para que carguen en la subcarpeta `/SIGR/`.

## [1.1.0] - 2026-11-07

### Agregado
- Fotos de stock gratuitas de Pexels: banner en el menú, fondo en el inicio de sesión y una miniatura por plato (créditos en `docs/CREDITOS_IMAGENES.md`).
- Campo de imagen (URL o ruta) en el formulario de platos del administrador.
- Migración automática: los datos guardados con v1.0.0 reciben la imagen de cada plato de demostración.

## [1.0.0] - 2026-11-07 · Línea base

### Agregado
- Estructura inicial del proyecto con Vite 5 y Vue 3, scripts `dev`, `build`, `preview` y `test`.
- Capa de persistencia en `localStorage` con datos iniciales (usuarios de demostración, categorías, platos y mesas) y sincronización entre pestañas.
- Módulo de autenticación con roles cliente, mesero y administrador, permisos por sección y administración de usuarios.
- Módulo de menú digital con CRUD de categorías y platos y control de disponibilidad.
- Módulo de pedidos con registro por mesa o para llevar, seguimiento por estados con historial y cancelación.
- Módulo de reservas por fecha y hora con asignación automática de mesa, horario de atención y control de cruces de 2 horas.
- Módulo de facturación con consecutivo `FV-00000`, impuesto al consumo del 8 % y método de pago.
- Módulo de caja y reportes con reporte de ventas diario, platos más vendidos, exportación CSV y cierre de caja con arqueo de efectivo.
- Pruebas básicas de integración de los servicios con el corredor nativo de Node (`npm test`).
- Documentación técnica: README, estructura de la base de datos, manual de despliegue, acta de línea base y licencia MIT.

### Corregido
- Las fechas de pedidos, facturas, reservas y cierres usan el día local y no el UTC, para que la caja no cambie de día a las 7 p. m. (hora de Colombia).

[Sin publicar]: https://github.com/JulianJJ5/SIGR/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/JulianJJ5/SIGR/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/JulianJJ5/SIGR/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/JulianJJ5/SIGR/releases/tag/v1.0.0
