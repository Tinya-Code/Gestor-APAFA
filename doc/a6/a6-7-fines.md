# A6 M7 — Multas

---

## GET `/api/v1/fines`

**Descripción:** Lista multas con filtros.

**Actores:** N1–N4

**Pseudocódigo:**
```javascript
function listFines(page, limit, parentId, eventId, paid) {
  // Recibe: paginación y filtros opcionales (padre, evento, estado de pago)

  // Consulta: multas en la base de datos
  // Aplica filtros si se proporcionan
  // Incluye: nombre del padre y título del evento

  // Devuelve: lista de multas paginada
}
```

**Parámetros de consulta:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| page | integer | No | Número de página |
| limit | integer | No | Resultados por página |
| parent_id | integer | No | Filtrar por padre |
| event_id | integer | No | Filtrar por evento |
| paid | boolean | No | Filtrar por estado de pago |

**Respuesta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "parent_id": 5,
      "parent_name": "Carlos López",
      "event_id": 1,
      "event_title": "Festival Escolar",
      "amount": 5000,
      "paid": false,
      "generated_date": "2026-04-11",
      "payment_date": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "total_pages": 1
  }
}
```

---

## GET `/api/v1/fines/:id`

**Descripción:** Retorna el detalle de una multa.

**Actores:** N1–N4

**Pseudocódigo:**
```javascript
function getFine(fineId) {
  // Recibe: id de la multa

  // Consulta: datos de la multa
  // Consulta: información del padre y del evento

  // Devuelve: la multa completa con datos del padre y evento
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID de la multa |

**Respuesta (200):**
```json
{
  "data": {
    "id": 1,
    "parent_id": 5,
    "parent": {
      "id": 5,
      "name": "Carlos",
      "surname": "López"
    },
    "event_id": 1,
    "event": {
      "id": 1,
      "title": "Festival Escolar"
    },
    "amount": 5000,
    "paid": false,
    "generated_date": "2026-04-11",
    "payment_date": null
  }
}
```

---

## POST `/api/v1/fines`

**Descripción:** Registra una multa manual.

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function createFine(data) {
  // Recibe: id del padre, id del evento y monto

  // Valida: que el padre exista
  // Valida: que el evento exista
  // Valida: que el monto sea positivo

  // Procesa: crea la multa con estado "no pagado" y fecha actual

  // Devuelve: la multa creada
}
```

**Cuerpo de la solicitud:**
```json
{
  "parent_id": 5,
  "event_id": 1,
  "amount": 5000
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| parent_id | integer | ✅ | ID del padre |
| event_id | integer | ✅ | ID del evento |
| amount | number | ✅ | Monto de la multa |

**Respuesta (201):** Objeto multa con `id`, `generated_date` y `paid: false`.

---

## POST `/api/v1/fines/generate`

**Descripción:** Genera multas automáticas por inasistencia (proceso por lote).

**Actores:** N1, N6

**Pseudocódigo:**
```javascript
function generateFines(eventId) {
  // Recibe: id del evento

  // Valida: que el evento exista
  // Valida: que el evento tenga genera_fine = true

  // Consulta: todos los padres que no asistieron al evento
  // (cruza registros de asistencia con attended = false)

  // Procesa: para cada padre ausente, crea una multa
  // con el monto definido en el evento (fine_amount)

  // Devuelve: cantidad de multas generadas
}
```

**Cuerpo de la solicitud:**
```json
{
  "event_id": 1
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| event_id | integer | ✅ | ID del evento para generar multas |

**Respuesta (200):**
```json
{
  "data": {
    "generated": 12,
    "event_id": 1,
    "message": "12 multas generadas para padres ausentes"
  }
}
```

**Lógica:** Cruza los registros de asistencia donde `attended: false` con eventos donde `generates_fine: true`. Crea una multa por cada padre ausente usando el `fine_amount` del evento.

---

## PUT `/api/v1/fines/:id`

**Descripción:** Edita una multa (monto o estado de pago).

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function updateFine(fineId, data) {
  // Recibe: id de la multa y campos a actualizar

  // Valida: que la multa exista

  // Procesa: actualiza los campos proporcionados
  // Si se marca como pagado, registra la fecha de pago

  // Devuelve: la multa actualizada
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID de la multa |

**Cuerpo de la solicitud:**
```json
{
  "amount": 6000,
  "paid": true,
  "payment_date": "2026-05-01"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| amount | number | No | Monto actualizado |
| paid | boolean | No | Estado de pago |
| payment_date | string | No | Fecha de pago (YYYY-MM-DD) |

**Respuesta (200):** Objeto multa actualizado.

---

## DELETE `/api/v1/fines/:id`

**Descripción:** Elimina una multa.

**Actores:** N1

**Pseudocódigo:**
```javascript
function deleteFine(fineId) {
  // Recibe: id de la multa

  // Valida: que el usuario sea administrador (N1)
  // Valida: que la multa exista

  // Procesa: elimina el registro de la multa

  // Devuelve: confirmación de eliminación
}
```

**Respuesta (200):**
```json
{
  "data": {
    "message": "Multa eliminada exitosamente"
  }
}
```

---

## GET `/api/v1/parents/:id/fines`

**Descripción:** Retorna el estado de multas de un padre específico.

**Actores:** N1–N4

**Pseudocódigo:**
```javascript
function getParentFines(parentId) {
  // Recibe: id del padre

  // Consulta: todas las multas del padre
  // Calcula: totales pagados y pendientes

  // Devuelve: resumen de multas con montos totales y cantidad
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del padre |

**Respuesta (200):**
```json
{
  "data": {
    "parent_id": 5,
    "parent_name": "Carlos López",
    "total_fines": 3,
    "total_amount": 15000,
    "paid_count": 1,
    "pending_count": 2,
    "pending_amount": 10000,
    "fines": [
      {
        "id": 1,
        "event_title": "Festival Escolar",
        "amount": 5000,
        "paid": true,
        "payment_date": "2026-05-01"
      }
    ]
  }
}
```
