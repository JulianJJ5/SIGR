# Estructura de la base de datos · SIGR v1.0.0

En la línea base, la persistencia es un único documento JSON guardado en el `localStorage` del navegador con la clave `sigr_db_v1` (ver `src/db/storage.js`). Cada colección equivale a una tabla; las relaciones se hacen por identificador. Esta estructura es la que se migraría a una base de datos relacional en una versión posterior.

## Modelo entidad-relación

```
USUARIO 1 ───< PEDIDO >─── 0..1 MESA
                 │
                 ├──< LINEA_PEDIDO >─── 1 PLATO >─── 1 CATEGORIA
                 │
                 └── 0..1 FACTURA

USUARIO 0..1 ───< RESERVA >─── 1 MESA
USUARIO 1 ───< CIERRE_CAJA
```

## Colecciones

### usuarios
| Campo | Tipo | Descripción |
|---|---|---|
| id | entero, PK | Identificador |
| nombre | texto | Nombre completo |
| usuario | texto, único | Nombre de inicio de sesión |
| clave | texto | Contraseña (sin cifrar en el prototipo) |
| rol | `cliente` \| `mesero` \| `administrador` | Define los permisos |
| activo | booleano | Un usuario inactivo no puede entrar |

### categorias
| Campo | Tipo | Descripción |
|---|---|---|
| id | entero, PK | Identificador |
| nombre | texto, único | Entradas, Platos fuertes, Bebidas… |

### platos
| Campo | Tipo | Descripción |
|---|---|---|
| id | entero, PK | Identificador |
| nombre | texto | Nombre del plato |
| descripcion | texto | Descripción corta |
| precio | entero (COP) | Precio antes de impuesto, mayor que 0 |
| categoriaId | entero, FK → categorias.id | Categoría |
| disponible | booleano | Si se puede pedir |

### mesas
| Campo | Tipo | Descripción |
|---|---|---|
| id | entero, PK | Identificador |
| numero | entero | Número visible |
| capacidad | entero | Personas |

### pedidos
| Campo | Tipo | Descripción |
|---|---|---|
| id | entero, PK | Número de pedido |
| mesaId | entero, FK → mesas.id, nulo | Nulo = para llevar o en línea |
| usuarioId | entero, FK → usuarios.id | Quién lo registró |
| lineas | lista de LINEA_PEDIDO | `{ platoId, nombre, precio, cantidad, subtotal }`; se copian nombre y precio para conservar el valor histórico |
| total | entero | Suma de subtotales |
| observaciones | texto | Indicaciones a cocina |
| estado | `recibido` \| `en preparación` \| `listo` \| `entregado` \| `cancelado` | Estado actual |
| historial | lista `{ estado, fecha }` | Trazabilidad de cada cambio de estado |
| facturaId | entero, FK → facturas.id, nulo | Factura asociada |
| creado | fecha-hora ISO | Fecha de creación |
| dia | fecha `AAAA-MM-DD` | Día local, para los reportes |

### reservas
| Campo | Tipo | Descripción |
|---|---|---|
| id | entero, PK | Identificador |
| nombreCliente | texto | A nombre de quién |
| telefono | texto | Contacto |
| fecha | fecha `AAAA-MM-DD` | Día de la reserva |
| hora | `HH:MM` | Entre 12:00 y 21:00 |
| personas | entero | Comensales |
| mesaId | entero, FK → mesas.id | Asignada automáticamente (la más pequeña libre) |
| usuarioId | entero, FK → usuarios.id, nulo | Quién reservó |
| estado | `pendiente` \| `confirmada` \| `cancelada` | Estado |

### facturas
| Campo | Tipo | Descripción |
|---|---|---|
| id | entero, PK | Consecutivo |
| numero | texto | `FV-00001` |
| pedidoId | entero, FK → pedidos.id, único | Pedido facturado |
| lineas | lista | Copia de las líneas del pedido |
| base | entero | Subtotal |
| impuesto | entero | Impuesto al consumo (8 % de la base) |
| total | entero | base + impuesto |
| metodoPago | `efectivo` \| `tarjeta` \| `transferencia` | Forma de pago |
| fecha | fecha-hora ISO | Momento de la factura |
| dia | fecha `AAAA-MM-DD` | Día local |

### cierresCaja
| Campo | Tipo | Descripción |
|---|---|---|
| id | entero, PK | Identificador |
| fecha | fecha `AAAA-MM-DD`, único | Día cerrado (solo un cierre por día) |
| usuarioId | entero, FK → usuarios.id | Quién cerró |
| reporte | objeto | Copia del reporte diario al momento del cierre |
| efectivoEsperado | entero | Ventas en efectivo según facturas |
| efectivoContado | entero | Arqueo físico |
| diferencia | entero | contado − esperado |
| registrado | fecha-hora ISO | Momento del cierre |

### contadores
Último identificador usado por entidad (`pedido`, `reserva`, `factura`, `cierre`, `usuario`, `categoria`, `plato`), para generar consecutivos.

## Reglas de integridad aplicadas en los servicios

- No se elimina una categoría con platos.
- Solo se pide un plato disponible.
- Solo se factura un pedido entregado, una sola vez y si la caja del día no está cerrada.
- Una reserva ocupa la mesa 2 horas; no se asignan dos reservas que se crucen en la misma mesa.
- Solo hay un cierre de caja por día.
- No se puede desactivar al único administrador activo.
