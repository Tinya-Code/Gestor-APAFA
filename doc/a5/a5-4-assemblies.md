# M4 / F4 — Asambleas (Multi-Tenant)

**Entidades:** Asamblea, DetalleAsamblea

> **Multi-Tenant:** Todos los endpoints filtran por `colegio_id` del token JWT.

---

## Backend — Endpoints REST

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 1 | GET | `/api/v1/assemblies` | Lista asambleas DEL COLEGIO | SA, P, V, T, S | Listar asambleas |
| 2 | GET | `/api/v1/assemblies/:id` | Detalle de asamblea DEL COLEGIO (incluye detalles) | SA, P, V, T, S | Ver detalle de asamblea |
| 3 | POST | `/api/v1/assemblies` | Registra una asamblea EN EL COLEGIO | SA, P | Registrar asamblea |
| 4 | PUT | `/api/v1/assemblies/:id` | Edita una asamblea DEL COLEGIO | SA, P | Editar asamblea |
| 5 | DELETE | `/api/v1/assemblies/:id` | Elimina una asamblea DEL COLEGIO | SA, P | Eliminar asamblea |
| 6 | POST | `/api/v1/assemblies/:id/details` | Registra un detalle/acuerdo DEL COLEGIO | SA, P, S | Registrar detalle de asamblea |
| 7 | PUT | `/api/v1/assemblies/:id/details/:detailId` | Edita un detalle DEL COLEGIO | SA, P, S | Editar detalle de asamblea |
| 8 | DELETE | `/api/v1/assemblies/:id/details/:detailId` | Elimina un detalle DEL COLEGIO | SA, P | Eliminar detalle de asamblea |

---

## Frontend — Pantallas y Componentes

### Pantallas

| # | Pantalla | Actores | Consume |
|---|----------|---------|---------|
| 1 | Lista de asambleas | SA, P, V, T, S | `GET /assemblies` |
| 2 | Detalle de asamblea + lista de detalles | SA, P, V, T, S | `GET /assemblies/:id` |
| 3 | Formulario asamblea (crear/editar) | SA, P | `POST/PUT /assemblies` |
| 4 | Formulario detalle de asamblea (crear/editar) | SA, P, S | `POST/PUT /assemblies/:id/details` |

### Desglose de Componentes

| Componente | Tipo | Consume | Descripción |
|------------|------|---------|-------------|
| Tabla de Asambleas | Tabla | `GET /assemblies` | Lista con título, fecha y descripción |
| Tarjeta Detalle Asamblea | Tarjeta | `GET /assemblies/:id` | Info completa + lista anidada de detalles |
| Formulario Asamblea | Formulario | `POST/PUT /assemblies` | Crear/editar: título, fecha, descripción |
| Formulario Detalle | Formulario | `POST/PUT /assemblies/:id/details` | Crear/editar detalle: descripción, fecha, URL de imagen |
| Tabla de Detalles | Tabla | `GET /assemblies/:id` | Lista anidada de acuerdos/notas |

---

## Casos de Uso (de A4)

| Caso de Uso | SA | P | V | T | S | Vo | Pa |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Listar asambleas | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver detalle de asamblea | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Registrar asamblea | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Editar asamblea | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Eliminar asamblea | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Registrar detalle de asamblea | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Editar detalle de asamblea | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Eliminar detalle de asamblea | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
