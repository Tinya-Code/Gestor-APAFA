# M7 / F7 — Multas (Multi-Tenant)

**Entidad:** Multa

> **Multi-Tenant:** Todos los endpoints filtran por `colegio_id` del token JWT.

---

## Backend — Endpoints REST

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 1 | GET | `/api/v1/fines` | Lista multas DEL COLEGIO | N0–N4 | Listar multas |
| 2 | GET | `/api/v1/fines/:id` | Detalle de multa DEL COLEGIO | N0–N4 | Ver detalle de multa |
| 3 | POST | `/api/v1/fines` | Registra multa manual EN EL COLEGIO | N0, N1, N2, N3 | Registrar multa manual |
| 4 | POST | `/api/v1/fines/generate` | Genera multas automáticas EN EL COLEGIO | N0, N1, N6 | Generar multas por inasistencia |
| 5 | PUT | `/api/v1/fines/:id` | Edita multa DEL COLEGIO | N0, N1, N2, N3 | Editar multa |
| 6 | DELETE | `/api/v1/fines/:id` | Elimina multa DEL COLEGIO | N0, N1 | Eliminar multa |
| 7 | GET | `/api/v1/parents/:id/fines` | Estado de multas de un padre DEL COLEGIO | N0–N4 | Ver estado de multas por padre |

---

## Frontend — Pantallas y Componentes

### Pantallas

| # | Pantalla | Actores | Consume |
|---|----------|---------|---------|
| 1 | Lista de multas | N1–N4 | `GET /fines` |
| 2 | Detalle de multa | N1–N4 | `GET /fines/:id` |
| 3 | Formulario multa manual (crear/editar) | N1, N2, N3 | `POST/PUT /fines` |
| 4 | Estado de multas por padre | N1–N4 | `GET /parents/:id/fines` |
| 5 | Generación automática (sistema) | N6 | `POST /fines/generate` |

### Desglose de Componentes

| Componente | Tipo | Consume | Descripción |
|------------|------|---------|-------------|
| Tabla de Multas | Tabla | `GET /fines` | Lista con padre, evento, monto, estado de pago |
| Tarjeta Detalle Multa | Tarjeta | `GET /fines/:id` | Info completa: padre, evento, monto, fechas |
| Formulario Multa | Formulario | `POST/PUT /fines` | Crear/editar multa manual: padre, evento, monto |
| Estado Multas Padre | Tabla | `GET /parents/:id/fines` | Resumen de multas para un padre específico |

---

## Casos de Uso (de A4)

| Caso de Uso | N0 | N1 | N2 | N3 | N4 | N5 | N6 |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Listar multas | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver detalle de multa | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Registrar multa manual | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Generar multas por inasistencia | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Editar multa | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Eliminar multa | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver estado de multas por padre | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
