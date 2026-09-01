# M2 / F2 — Padres y Estudiantes

**Entidades:** Parent, Student

---

## Backend — Endpoints REST

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 1 | GET | `/api/v1/parents` | Lista padres (paginado, filtros) | N1–N4 | Listar padres |
| 2 | GET | `/api/v1/parents/:id` | Detalle de un padre | N1–N4 | Ver detalle de padre |
| 3 | POST | `/api/v1/parents` | Registra un padre | N1, N2 | Registrar padre |
| 4 | PUT | `/api/v1/parents/:id` | Edita un padre | N1, N2 | Editar padre |
| 5 | DELETE | `/api/v1/parents/:id` | Elimina un padre | N1 | Eliminar padre |
| 6 | GET | `/api/v1/students` | Lista estudiantes (filtro por grado/sección/padre) | N1–N4 | Listar estudiantes |
| 7 | GET | `/api/v1/students/:id` | Detalle de un estudiante | N1–N4 | Ver detalle de estudiante |
| 8 | POST | `/api/v1/students` | Registra un estudiante | N1, N2 | Registrar estudiante |
| 9 | PUT | `/api/v1/students/:id` | Edita un estudiante | N1, N2 | Editar estudiante |
| 10 | DELETE | `/api/v1/students/:id` | Elimina un estudiante | N1 | Eliminar estudiante |
| 11 | PATCH | `/api/v1/students/:id/parent` | Asocia/reasigna estudiante a un padre (`parent_id`) | N1, N2 | Asociar estudiante a padre |

---

## Frontend — Pantallas y Componentes

### Pantallas

| # | Pantalla | Actores | Consume |
|---|----------|---------|---------|
| 1 | Lista de padres | N1–N4 | `GET /parents` |
| 2 | Detalle de padre | N1–N4 | `GET /parents/:id` |
| 3 | Formulario padre (crear/editar) | N1, N2 | `POST/PUT /parents` |
| 4 | Lista de estudiantes | N1–N4 | `GET /students` |
| 5 | Detalle de estudiante | N1–N4 | `GET /students/:id` |
| 6 | Formulario estudiante (crear/editar, asociar a padre) | N1, N2 | `POST/PUT /students`, `PATCH /students/:id/parent` |

### Desglose de Componentes

| Componente | Tipo | Consume | Descripción |
|------------|------|---------|-------------|
| Tabla de Padres | Tabla | `GET /parents` | Lista paginada con filtros (nombre, DNI) |
| Tarjeta Detalle Padre | Tarjeta | `GET /parents/:id` | Muestra info del padre y estudiantes vinculados |
| Formulario Padre | Formulario | `POST/PUT /parents` | Crear/editar padre: nombre, apellido, DNI, teléfono, email |
| Tabla de Estudiantes | Tabla | `GET /students` | Lista paginada con filtros de grado/sección/padre |
| Tarjeta Detalle Estudiante | Tarjeta | `GET /students/:id` | Muestra info del estudiante y padre vinculado |
| Formulario Estudiante | Formulario | `POST/PUT /students` | Crear/editar estudiante: nombre, apellido, grado, sección |
| Selector de Asignación Padre | Selector | `PATCH /students/:id/parent` | Reasignar estudiante a otro padre |

---

## Casos de Uso (de A4)

| Caso de Uso | N1 | N2 | N3 | N4 | N5 | N6 |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|
| Listar padres | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver detalle de padre | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Registrar padre | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar padre | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Eliminar padre | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Listar estudiantes | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver detalle de estudiante | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Registrar estudiante | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar estudiante | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Eliminar estudiante | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Asociar estudiante a padre | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
