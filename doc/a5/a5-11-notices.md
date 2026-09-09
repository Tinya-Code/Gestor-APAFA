# M11 / F11 — Avisos (Multi-Tenant)

**Entidad:** Aviso

> **Multi-Tenant:** Todos los endpoints filtran por `colegio_id` del token JWT.

---

## Backend — Endpoints REST

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 1 | GET | `/api/v1/notices` | Lista avisos DEL COLEGIO | N0–N5 | Listar avisos |
| 2 | GET | `/api/v1/notices/:id` | Detalle de un aviso DEL COLEGIO | N0–N5 | Ver detalle de aviso |

> Los avisos no tienen endpoints de escritura expuestos al usuario: se crean internamente cuando M5 (Eventos) o M7 (Multas) disparan una notificación (`type` + `reference_id`).

---

## Frontend — Pantallas y Componentes

### Pantallas

| # | Pantalla | Actores | Consume |
|---|----------|---------|---------|
| 1 | Lista de avisos | N1–N5 | `GET /notices` |
| 2 | Detalle de aviso | N1–N5 | `GET /notices/:id` |

### Desglose de Componentes

| Componente | Tipo | Consume | Descripción |
|------------|------|---------|-------------|
| Tabla de Avisos | Tabla | `GET /notices` | Lista con título, tipo, fecha |
| Tarjeta Detalle Aviso | Tarjeta | `GET /notices/:id` | Info completa: título, mensaje, tipo, fecha |

---

## Casos de Uso (de A4)

| Caso de Uso | N0 | N1 | N2 | N3 | N4 | N5 | N6 |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Listar avisos | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Ver detalle de aviso | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
