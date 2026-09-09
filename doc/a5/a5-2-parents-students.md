# M2 / F2 — Padres y Estudiantes (Multi-Tenant)

**Entidades:** Padre, Estudiante

> **Modelo Multi-Tenant:** Todos los endpoints filtran por `colegio_id` del token JWT.
> Cada colegio solo ve sus propios padres y estudiantes.

---

## Backend — Endpoints REST

### Padres (filtrados por colegio_id)

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 1 | GET | `/api/v1/parents` | Lista padres DEL COLEGIO (paginado, filtros) | N0–N4 | Listar padres |
| 2 | GET | `/api/v1/parents/:id` | Detalle de un padre DEL COLEGIO | N0–N4 | Ver detalle de padre |
| 3 | POST | `/api/v1/parents` | Registra un padre EN EL COLEGIO | N0, N1, N2 | Registrar padre |
| 4 | PUT | `/api/v1/parents/:id` | Edita un padre DEL COLEGIO | N0, N1, N2 | Editar padre |
| 5 | DELETE | `/api/v1/parents/:id` | Elimina un padre DEL COLEGIO | N0, N1 | Eliminar padre |

### Estudiantes (filtrados por colegio_id)

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 6 | GET | `/api/v1/students` | Lista estudiantes DEL COLEGIO (filtro por grado/sección/padre) | N0–N4 | Listar estudiantes |
| 7 | GET | `/api/v1/students/:id` | Detalle de un estudiante DEL COLEGIO | N0–N4 | Ver detalle de estudiante |
| 8 | POST | `/api/v1/students` | Registra un estudiante EN EL COLEGIO | N0, N1, N2 | Registrar estudiante |
| 9 | PUT | `/api/v1/students/:id` | Edita un estudiante DEL COLEGIO | N0, N1, N2 | Editar estudiante |
| 10 | DELETE | `/api/v1/students/:id` | Elimina un estudiante DEL COLEGIO | N0, N1 | Eliminar estudiante |
| 11 | PATCH | `/api/v1/students/:id/parent` | Asocia/reasigna estudiante a un padre DEL COLEGIO | N0, N1, N2 | Asociar estudiante a padre |

---

## Frontend — Pantallas y Componentes

### Pantallas

| # | Pantalla | Actores | Consume |
|---|----------|---------|---------|
| 1 | Lista de padres | N0–N4 | `GET /parents` |
| 2 | Detalle de padre | N0–N4 | `GET /parents/:id` |
| 3 | Formulario padre (crear/editar) | N0, N1, N2 | `POST/PUT /parents` |
| 4 | Lista de estudiantes | N0–N4 | `GET /students` |
| 5 | Detalle de estudiante | N0–N4 | `GET /students/:id` |
| 6 | Formulario estudiante (crear/editar, asociar a padre) | N0, N1, N2 | `POST/PUT /students`, `PATCH /students/:id/parent` |

### Desglose de Componentes

| Componente | Tipo | Consume | Descripción |
|------------|------|---------|-------------|
| Tabla de Padres | Tabla | `GET /parents` | Lista paginada con filtros (nombre, DNI) — SOLO DEL COLEGIO |
| Tarjeta Detalle Padre | Tarjeta | `GET /parents/:id` | Muestra info del padre y estudiantes vinculados — DEL COLEGIO |
| Formulario Padre | Formulario | `POST/PUT /parents` | Crear/editar padre: nombre, apellido, DNI, teléfono, email |
| Tabla de Estudiantes | Tabla | `GET /students` | Lista paginada con filtros de grado/sección/padre — SOLO DEL COLEGIO |
| Tarjeta Detalle Estudiante | Tarjeta | `GET /students/:id` | Muestra info del estudiante y padre vinculado — DEL COLEGIO |
| Formulario Estudiante | Formulario | `POST/PUT /students` | Crear/editar estudiante: nombre, apellido, grado, sección |
| Selector de Asignación Padre | Selector | `PATCH /students/:id/parent` | Reasignar estudiante a otro padre — DEL COLEGIO |

---

## Casos de Uso (de A4)

| Caso de Uso | N0 | N1 | N2 | N3 | N4 | N5 | N6 |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Listar padres | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver detalle de padre | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Registrar padre | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar padre | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Eliminar padre | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Listar estudiantes | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver detalle de estudiante | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Registrar estudiante | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar estudiante | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Eliminar estudiante | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Asociar estudiante a padre | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Notas de Implementación

### Queries Multi-Tenant

```sql
-- LISTAR PADRES (filtrado por colegio)
SELECT * FROM padre
WHERE colegio_id = :token_colegio_id
AND deleted_at IS NULL
ORDER BY name;

-- CREAR PADRE (con colegio del token)
INSERT INTO padre (colegio_id, name, surname, dni, phone, email)
VALUES (:token_colegio_id, :name, :surname, :dni, :phone, :email);

-- UNICIDAD: mismo DNI puede existir en distintos colegios
-- La unique key es (dni, colegio_id), no solo dni
```

### Validaciones Multi-Tenant

1. **Crear padre:** verificar que el DNI no exista EN ESE COLEGIO
2. **Editar padre:** verificar que el padre pertenezca AL COLEGIO del token
3. **Eliminar padre:** verificar que el padre pertenezca AL COLEGIO del token
4. **Asociar estudiante:** verificar que tanto el estudiante como el padre pertenezcan AL MISMO COLEGIO

### Seguridad

- Nunca exponer `colegio_id` en el frontend (viene del token)
- Todas las queries DEBEN incluir `WHERE colegio_id = :token_colegio_id`
- Un usuario no puede acceder a padres de otro colegio ni siquiera conociendo su ID
