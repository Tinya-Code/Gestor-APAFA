# M3 / F3 — Directiva (Multi-Tenant)

**Entidad:** Directiva

> **Multi-Tenant:** Todos los endpoints filtran por `colegio_id` del token JWT.

---

## Backend — Endpoints REST

### Mandatos de Directiva

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 1 | GET | `/api/v1/directiva` | Lista miembros de la directiva DEL COLEGIO | N0–N4 | Listar directiva |
| 2 | GET | `/api/v1/directiva/:id` | Detalle de un miembro DEL COLEGIO | N0–N4 | Ver detalle de miembro |
| 3 | POST | `/api/v1/directiva` | Registra un miembro EN EL COLEGIO | N0, N1, N2 | Registrar miembro |
| 4 | PUT | `/api/v1/directiva/:id` | Edita un miembro DEL COLEGIO | N0, N1, N2 | Editar miembro |
| 5 | DELETE | `/api/v1/directiva/:id` | Elimina un miembro DEL COLEGIO | N0, N1 | Eliminar miembro |

### Reemplazos Temporales

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 6 | GET | `/api/v1/directiva/reemplazos` | Lista reemplazos DEL COLEGIO | N0–N4 | Listar reemplazos |
| 7 | GET | `/api/v1/directiva/reemplazos/:id` | Detalle de un reemplazo | N0–N4 | Ver detalle de reemplazo |
| 8 | POST | `/api/v1/directiva/reemplazos` | Crea un reemplazo temporal | N0, N1 | Autorizar reemplazo |
| 9 | PUT | `/api/v1/directiva/reemplazos/:id` | Actualiza un reemplazo (extender, desactivar) | N0, N1 | Modificar reemplazo |
| 10 | DELETE | `/api/v1/directiva/reemplazos/:id` | Finaliza un reemplazo | N0, N1 | Cancelar reemplazo |

---

## Frontend — Pantallas y Componentes

### Pantallas

| # | Pantalla | Actores | Consume |
|---|----------|---------|---------|
| 1 | Lista de directiva | N1–N4 | `GET /directiva` |
| 2 | Detalle de miembro | N1–N4 | `GET /directiva/:id` |
| 3 | Formulario miembro (crear/editar) | N1, N2 | `POST/PUT /directiva` |
| 4 | Lista de reemplazos | N1–N4 | `GET /directiva/reemplazos` |
| 5 | Formulario reemplazo (crear/editar) | N0, N1 | `POST/PUT /directiva/reemplazos` |

### Desglose de Componentes

| Componente | Tipo | Consume | Descripción |
|------------|------|---------|-------------|
| Tabla de Directiva | Tabla | `GET /directiva` | Lista con rol y rango de fechas |
| Tarjeta Detalle Miembro | Tarjeta | `GET /directiva/:id` | Info del miembro, rol y padre vinculado |
| Formulario Miembro | Formulario | `POST/PUT /directiva` | Crear/editar: vincular a padre, rol, fecha inicio/fin |
| Tabla de Reemplazos | Tabla | `GET /directiva/reemplazos` | Lista de reemplazos activos/histórico |
| Formulario Reemplazo | Formulario | `POST/PUT /directiva/reemplazos` | Autorizar reemplazo: vocal, rol, fechas, motivo |

---

## Casos de Uso (de A4)

### Mandatos de Directiva

| Caso de Uso | N0 | N1 | N2 | N3 | N4 | N5 | N6 |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Listar directiva | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver detalle de miembro | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Registrar miembro | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar miembro | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Eliminar miembro | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Reemplazos Temporales

| Caso de Uso | N0 | N1 | N2 | N3 | N4 | N5 | N6 |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Listar reemplazos | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver detalle de reemplazo | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Autorizar reemplazo | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Modificar reemplazo | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cancelar reemplazo | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
