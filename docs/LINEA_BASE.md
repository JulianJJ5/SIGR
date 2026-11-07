# Acta de línea base · SIGR v1.0.0

| Elemento | Valor |
|---|---|
| Sistema | Sistema Integral de Gestión de Restaurante (SIGR) |
| Versión | 1.0.0 |
| Herramienta de versionado | Git |
| Repositorio oficial | https://github.com/JulianJJ5/SIGR |
| Rama estable | `main` |
| Etiqueta de la línea base | `v1.0.0` (anotada) |
| Commits incluidos | Desde el commit inicial hasta el commit etiquetado `v1.0.0` (su hash se obtiene con `git rev-parse --short "v1.0.0^{commit}"`) |
| Fecha de creación | 07/11/2026 |
| Validado por | Grupo de desarrollo |
| Responsable de aprobación | Coordinador del equipo |

## Elementos de configuración incluidos

| Elemento | Ubicación |
|---|---|
| Código fuente de la aplicación | `src/` |
| Pruebas de integración | `tests/servicios.test.js` |
| Configuración de compilación y dependencias | `package.json`, `package-lock.json`, `vite.config.js`, `index.html` |
| Documentación técnica | `README.md`, `CHANGELOG.md`, `LICENSE.txt`, `docs/` |

## Criterios verificados

- [x] Todos los módulos compilan (`npm run build` sin errores).
- [x] Funcionalidades críticas operativas y validadas manualmente: inicio de sesión por rol, pedido a mesa, avance de estados, facturación, reserva y cierre de caja.
- [x] Pruebas básicas de integración completadas (`npm test`: 4 de 4).
- [x] Estructura de carpetas y convenciones de código definidas (ver README).
- [x] Documentación técnica mínima adjunta: README, estructura de la base de datos y manual de despliegue.

## Cómo recuperar la línea base

```bash
git checkout v1.0.0
```

A partir de este punto, todo cambio pasa por una solicitud registrada en GitHub Issues, una rama `feature/` o `fix/` desde `develop`, revisión y fusión, y una nueva versión etiquetada (`v1.0.1`, `v1.1.0`…).
