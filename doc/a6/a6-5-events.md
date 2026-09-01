# A6 M5 — Eventos

---

## GET `/api/v1/events`

**Descripción:** Lista eventos.

**Actores:** N1–N5

**Pseudocódigo:**
```javascript
function listEvents(page, limit, dateFrom, dateTo) {
  // Recibe: paginación y filtros opcionales de fecha

  // Consulta: eventos en la base de datos
  // Aplica filtros de fecha si se proporcionan

  // Devuelve: lista de eventos paginada con sus flags de configuración
}
```

**Parámetros de consulta:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| page | integer | No | Número de página |
| limit | integer | No | Resultados por página |
| date_from | string | No | Filtrar desde fecha |
| date_to | string | No | Filtrar hasta fecha |

**Respuesta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Festival Escolar",
      "date": "2026-04-10",
      "description": "Festival anual de la escuela",
      "generates_fine": true,
      "fine_amount": 5000,
      "generates_attendance": true,
      "generates_expense": false,
      "generates_contribution": true,
      "contribution_amount": 2000
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "total_pages": 2
  }
}
```

---

## GET `/api/v1/events/:id`

**Descripción:** Retorna el detalle completo de un evento.

**Actores:** N1–N5

**Pseudocódigo:**
```javascript
function getEvent(eventId) {
  // Recibe: id del evento

  // Consulta: datos completos del evento incluyendo todos los flags

  // Devuelve: el evento con toda su configuración
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del evento |

**Respuesta (200):**
```json
{
  "data": {
    "id": 1,
    "assembly_id": null,
    "title": "Festival Escolar",
    "date": "2026-04-10",
    "description": "Festival anual de la escuela",
    "generates_fine": true,
    "fine_amount": 5000,
    "generates_attendance": true,
    "generates_expense": true,
    "generates_contribution": true,
    "contribution_amount": 2000,
    "created_at": "2026-01-10T08:00:00Z"
  }
}
```

---

## POST `/api/v1/events`

**Descripción:** Registra un nuevo evento.

**Actores:** N1, N2

**Pseudocódigo:**
```javascript
function createEvent(data) {
  // Recibe: título, fecha, descripción y flags de configuración
  // (genera_multa, monto_multa, genera_asistencia, genera_gasto,
  // genera_aporte, monto_aporte)

  // Valida: que los campos obligatorios estén presentes

  // Procesa: crea el registro del evento

  // Devuelve: el evento creado con su id
}
```

**Cuerpo de la solicitud:**
```json
{
  "assembly_id": null,
  "title": "Festival Escolar",
  "date": "2026-04-10",
  "description": "Festival anual de la escuela",
  "generates_fine": true,
  "fine_amount": 5000,
  "generates_attendance": true,
  "generates_expense": true,
  "generates_contribution": true,
  "contribution_amount": 2000
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| assembly_id | integer | No | Asamblea vinculada (nullable) |
| title | string | ✅ | Título del evento |
| date | string | ✅ | Fecha (YYYY-MM-DD) |
| description | string | No | Descripción |
| generates_fine | boolean | No | Genera multa por inasistencia (default: false) |
| fine_amount | number | No | Monto de la multa |
| generates_attendance | boolean | No | Registra asistencia (default: false) |
| generates_expense | boolean | No | Implica gastos (default: false) |
| generates_contribution | boolean | No | Recolecta aportes (default: false) |
| contribution_amount | number | No | Monto del aporte |

**Respuesta (201):** Objeto evento con `id` y `created_at`.

---

## PUT `/api/v1/events/:id`

**Descripción:** Edita un evento.

**Actores:** N1, N2

**Pseudocódigo:**
```javascript
function updateEvent(eventId, data) {
  // Recibe: id del evento y campos a actualizar

  // Valida: que el evento exista

  // Procesa: actualiza solo los campos proporcionados

  // Devuelve: el evento actualizado
}
```

**Cuerpo de la solicitud:** Igual que POST (todos los campos opcionales).

**Respuesta (200):** Objeto evento actualizado.

---

## DELETE `/api/v1/events/:id`

**Descripción:** Elimina un evento.

**Actores:** N1

**Pseudocódigo:**
```javascript
function deleteEvent(eventId) {
  // Recibe: id del evento

  // Valida: que el usuario sea administrador (N1)
  // Valida: que el evento exista

  // Procesa: elimina el evento y registros asociados
  // (asistencias, multas generadas)

  // Devuelve: confirmación de eliminación
}
```

**Respuesta (200):**
```json
{
  "data": {
    "message": "Evento eliminado exitosamente"
  }
}
```
