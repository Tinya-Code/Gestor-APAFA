# M3 / F3 — Directiva

**Entidad:** BoardMember

---

## Backend — Endpoints REST

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 1 | GET | `/api/v1/board-members` | Lista miembros de la directiva | N1–N4 | Listar directiva |
| 2 | GET | `/api/v1/board-members/:id` | Detalle de un miembro | N1–N4 | Ver detalle de miembro |
| 3 | POST | `/api/v1/board-members` | Registra un miembro (rol, start_date) | N1, N2 | Registrar miembro |
| 4 | PUT | `/api/v1/board-members/:id` | Edita un miembro (rol, end_date, etc.) | N1, N2 | Editar miembro |
| 5 | DELETE | `/api/v1/board-members/:id` | Elimina un miembro | N1 | Eliminar miembro |

---

## Frontend — Pantallas y Componentes

### Pantallas

| # | Pantalla | Actores | Consume |
|---|----------|---------|---------|
| 1 | Lista de directiva | N1–N4 | `GET /board-members` |
| 2 | Detalle de miembro | N1–N4 | `GET /board-members/:id` |
| 3 | Formulario miembro (crear/editar) | N1, N2 | `POST/PUT /board-members` |

### Desglose de Componentes

| Componente | Tipo | Consume | Descripción |
|------------|------|---------|-------------|
| Tabla de Directiva | Tabla | `GET /board-members` | Lista con rol y rango de fechas |
| Tarjeta Detalle Miembro | Tarjeta | `GET /board-members/:id` | Info del miembro, rol y padre vinculado |
| Formulario Miembro | Formulario | `POST/PUT /board-members` | Crear/editar: vincular a padre, rol, fecha inicio/fin |

---

## Casos de Uso (de A4)

| Caso de Uso | N1 | N2 | N3 | N4 | N5 | N6 |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|
| Listar directiva | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver detalle de miembro | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Registrar miembro | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar miembro | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Eliminar miembro | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
