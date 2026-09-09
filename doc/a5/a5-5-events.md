# M5 / F5 — Eventos (Multi-Tenant)

**Entidad:** Evento

> **Multi-Tenant:** Todos los endpoints filtran por `colegio_id` del token JWT.

---

## Backend — Endpoints REST

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 1 | GET | `/api/v1/events` | Lista eventos DEL COLEGIO | N0–N5 | Listar eventos |
| 2 | GET | `/api/v1/events/:id` | Detalle de evento DEL COLEGIO | N0–N5 | Ver detalle de evento |
| 3 | POST | `/api/v1/events` | Registra un evento EN EL COLEGIO | N0, N1, N2 | Registrar evento |
| 4 | PUT | `/api/v1/events/:id` | Edita un evento DEL COLEGIO | N0, N1, N2 | Editar evento |
| 5 | DELETE | `/api/v1/events/:id` | Elimina un evento DEL COLEGIO | N0, N1 | Eliminar evento |

---

## Frontend — Pantallas y Componentes

### Pantallas

| # | Pantalla | Actores | Consume |
|---|----------|---------|---------|
| 1 | Lista de eventos | N1–N5 | `GET /events` |
| 2 | Detalle de evento | N1–N5 | `GET /events/:id` |
| 3 | Formulario evento (crear/editar) | N1, N2 | `POST/PUT /events` |

### Desglose de Componentes

| Componente | Tipo | Consume | Descripción |
|------------|------|---------|-------------|
| Tabla de Eventos | Tabla | `GET /events` | Lista con título, fecha y flags |
| Tarjeta Detalle Evento | Tarjeta | `GET /events/:id` | Info completa: título, fecha, descripción, config de multa y asistencia |
| Formulario Evento | Formulario | `POST/PUT /events` | Crear/editar: título, fecha, descripción, genera_multa, monto_multa, genera_asistencia, genera_gasto, genera_aporte, monto_aporte |

---

## Casos de Uso (de A4)

| Caso de Uso | N0 | N1 | N2 | N3 | N4 | N5 | N6 |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Listar eventos | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Ver detalle de evento | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Registrar evento | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar evento | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Eliminar evento | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
