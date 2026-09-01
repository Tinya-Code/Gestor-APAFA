# M6 / F6 — Asistencias

**Entidad:** Attendance

---

## Backend — Endpoints REST

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 1 | GET | `/api/v1/events/:id/attendance` | Lista asistencias de un evento | N1–N4 | Listar asistencias por evento |
| 2 | POST | `/api/v1/events/:id/attendance` | Registra asistencia de un padre a un evento | N1, N2, N4 | Registrar asistencia |
| 3 | PUT | `/api/v1/events/:id/attendance/:attendanceId` | Edita un registro de asistencia | N1, N2, N4 | Editar asistencia |

---

## Frontend — Pantallas y Componentes

### Pantallas

| # | Pantalla | Actores | Consume |
|---|----------|---------|---------|
| 1 | Lista de asistencias por evento | N1–N4 | `GET /events/:id/attendance` |
| 2 | Formulario registrar/editar asistencia | N1, N2, N4 | `POST/PUT /events/:id/attendance` |

### Desglose de Componentes

| Componente | Tipo | Consume | Descripción |
|------------|------|---------|-------------|
| Tabla de Asistencias | Tabla | `GET /events/:id/attendance` | Lista de padres con estado de asistencia |
| Formulario Asistencia | Formulario | `POST/PUT /events/:id/attendance` | Seleccionar padre, marcar asistió/no asistió, registrar fecha |

---

## Casos de Uso (de A4)

| Caso de Uso | N1 | N2 | N3 | N4 | N5 | N6 |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|
| Listar asistencias por evento | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Registrar asistencia | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Editar asistencia | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
