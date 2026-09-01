# A6 M6 — Asistencias

---

## GET `/api/v1/events/:id/attendance`

**Descripción:** Lista registros de asistencia de un evento.

**Actores:** N1–N4

**Pseudocódigo:**
```javascript
function listAttendance(eventId, page, limit) {
  // Recibe: id del evento y paginación

  // Consulta: registros de asistencia del evento
  // Incluye: nombre del padre

  // Devuelve: lista de asistencias paginada
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del evento |

**Parámetros de consulta:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| page | integer | No | Número de página |
| limit | integer | No | Resultados por página |

**Respuesta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "event_id": 1,
      "parent_id": 5,
      "parent_name": "Carlos López",
      "attended": true,
      "registration_date": "2026-04-10"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 30,
    "total_pages": 2
  }
}
```

---

## POST `/api/v1/events/:id/attendance`

**Descripción:** Registra la asistencia de un padre a un evento.

**Actores:** N1, N2, N4

**Pseudocódigo:**
```javascript
function createAttendance(eventId, data) {
  // Recibe: id del evento, id del padre y si asistió

  // Valida: que el evento exista
  // Valida: que el padre exista
  // Valida: que no exista ya un registro de asistencia para ese padre en ese evento

  // Procesa: crea el registro de asistencia

  // Devuelve: el registro creado con id y fecha
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del evento |

**Cuerpo de la solicitud:**
```json
{
  "parent_id": 5,
  "attended": true
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| parent_id | integer | ✅ | ID del padre |
| attended | boolean | ✅ | Si el padre asistió |

**Respuesta (201):**
```json
{
  "data": {
    "id": 1,
    "event_id": 1,
    "parent_id": 5,
    "attended": true,
    "registration_date": "2026-04-10"
  }
}
```

**Errores:**
| Código | Descripción |
|--------|-------------|
| 422 | Ya existe un registro de asistencia para este padre/evento |

---

## PUT `/api/v1/events/:id/attendance/:attendanceId`

**Descripción:** Edita un registro de asistencia.

**Actores:** N1, N2, N4

**Pseudocódigo:**
```javascript
function updateAttendance(eventId, attendanceId, data) {
  // Recibe: ids de evento y asistencia, campos a actualizar

  // Valida: que la asistencia exista

  // Procesa: actualiza el estado de asistencia

  // Devuelve: el registro actualizado
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del evento |
| attendanceId | integer | ID de la asistencia |

**Cuerpo de la solicitud:**
```json
{
  "attended": false
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| attended | boolean | ✅ | Estado de asistencia actualizado |

**Respuesta (200):** Objeto asistencia actualizado.
