# M4 / F4 — Asambleas

**Entidades:** Assembly, AssemblyDetail

---

## Backend — Endpoints REST

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 1 | GET | `/api/v1/assemblies` | Lista asambleas | N1–N4 | Listar asambleas |
| 2 | GET | `/api/v1/assemblies/:id` | Detalle de asamblea (incluye detalles) | N1–N4 | Ver detalle de asamblea |
| 3 | POST | `/api/v1/assemblies` | Registra una asamblea | N1, N2 | Registrar asamblea |
| 4 | PUT | `/api/v1/assemblies/:id` | Edita una asamblea | N1, N2 | Editar asamblea |
| 5 | DELETE | `/api/v1/assemblies/:id` | Elimina una asamblea | N1 | Eliminar asamblea |
| 6 | POST | `/api/v1/assemblies/:id/details` | Registra un detalle/acuerdo de asamblea | N1, N2, N4 | Registrar detalle de asamblea |
| 7 | PUT | `/api/v1/assemblies/:id/details/:detailId` | Edita un detalle de asamblea | N1, N2, N4 | Editar detalle de asamblea |
| 8 | DELETE | `/api/v1/assemblies/:id/details/:detailId` | Elimina un detalle de asamblea | N1, N2 | Eliminar detalle de asamblea |

---

## Frontend — Pantallas y Componentes

### Pantallas

| # | Pantalla | Actores | Consume |
|---|----------|---------|---------|
| 1 | Lista de asambleas | N1–N4 | `GET /assemblies` |
| 2 | Detalle de asamblea + lista de detalles | N1–N4 | `GET /assemblies/:id` |
| 3 | Formulario asamblea (crear/editar) | N1, N2 | `POST/PUT /assemblies` |
| 4 | Formulario detalle de asamblea (crear/editar) | N1, N2, N4 | `POST/PUT /assemblies/:id/details` |

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

| Caso de Uso | N1 | N2 | N3 | N4 | N5 | N6 |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|
| Listar asambleas | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver detalle de asamblea | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Registrar asamblea | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar asamblea | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Eliminar asamblea | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Registrar detalle de asamblea | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Editar detalle de asamblea | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Eliminar detalle de asamblea | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
