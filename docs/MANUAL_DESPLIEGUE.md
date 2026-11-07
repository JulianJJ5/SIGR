# Manual de despliegue · SIGR v1.0.0

## 1. Entorno local (desarrollo)

1. Instalar Node.js 18 o superior (incluye npm). Comprobar con `node -v` y `npm -v`.
2. Clonar el repositorio y ubicarse en la línea base:
   ```bash
   git clone https://github.com/JulianJJ5/SIGR.git
   cd SIGR
   git checkout v1.0.0
   ```
3. Instalar dependencias: `npm install`
4. Ejecutar las pruebas: `npm test` (deben pasar las 4).
5. Iniciar el servidor de desarrollo: `npm run dev` y abrir `http://localhost:5173`.

## 2. Compilación para publicar

```bash
npm run build
```

Genera la carpeta `dist/` con archivos estáticos (`index.html`, JavaScript y CSS minificados). Para revisarla localmente: `npm run preview` (`http://localhost:4173`).

## 3. Publicación

Como la línea base no tiene servidor propio (los datos viven en el navegador), `dist/` se puede publicar en cualquier hosting de archivos estáticos:

- **GitHub Pages:** subir `dist/` a la rama `gh-pages` o usar una acción de GitHub; si el sitio queda en una subruta (`/sigr/`), agregar `base: "/sigr/"` en `vite.config.js` antes de compilar.
- **Netlify o Vercel:** comando de compilación `npm run build`, carpeta de publicación `dist`.
- **Servidor propio (Nginx, Apache, IIS):** copiar el contenido de `dist/` a la carpeta pública del sitio.

## 4. Datos

- Al abrir la app por primera vez se cargan los datos iniciales de `src/db/seed.js` (usuarios de demostración, 4 categorías, 8 platos y 5 mesas).
- Los datos quedan en el `localStorage` del navegador; cada navegador tiene sus propios datos.
- El administrador puede volver al estado inicial desde **Usuarios → Restaurar datos iniciales**.

## 5. Verificación después de desplegar

1. Entrar como **mesero**, agregar platos y enviar un pedido a una mesa.
2. Avanzar el pedido hasta «entregado» y facturarlo.
3. Crear una reserva para mañana a las 19:00 y confirmarla.
4. Entrar como **administrador** y revisar en **Caja y reportes** que la venta aparezca; cerrar la caja.

## 6. Limitaciones conocidas de la línea base

- Sin servidor ni base de datos central: el «tiempo real» funciona entre pestañas del mismo navegador (evento `storage`), no entre equipos distintos.
- Contraseñas sin cifrar y sin control de sesión del lado del servidor.
- Estas limitaciones se registran como mejoras futuras en GitHub Issues y se abordarán mediante el control de cambios sobre esta línea base.
