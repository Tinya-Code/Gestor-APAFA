# A6 M8 — Ingresos

---

## GET `/api/v1/income`

**Descripción:** Lista registros de ingreso con filtros.

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function listIncome(page, limit, type, dateFrom, dateTo, parentId) {
  // Recibe: paginación y filtros opcionales (tipo, fecha, padre)

  // Consulta: ingresos en la base de datos
  // Aplica filtros si se proporcionan
  // Incluye: nombre del padre y título del evento

  // Devuelve: lista de ingresos paginada
}
```

**Parámetros de consulta:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| page | integer | No | Número de página |
| limit | integer | No | Resultados por página |
| type | string | No | Filtrar por tipo (donation, fine, contribution, fee) |
| date_from | string | No | Filtrar desde fecha |
| date_to | string | No | Filtrar hasta fecha |
| parent_id | integer | No | Filtrar por padre |

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
      "board_member_id": 2,
      "amount": 2000,
      "date": "2026-04-10",
      "description": "Aporte al festival",
      "type": "contribution"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "total_pages": 3
  }
}
```

---

## GET `/api/v1/income/:id`

**Descripción:** Retorna el detalle de un ingreso.

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function getIncome(incomeId) {
  // Recibe: id del ingreso

  // Consulta: datos del ingreso
  // Consulta: información del padre, evento y directivo

  // Devuelve: el ingreso completo con todas las referencias
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del ingreso |

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
    "board_member_id": 2,
    "board_member_name": "Ana Martínez",
    "amount": 2000,
    "date": "2026-04-10",
    "description": "Aporte al festival",
    "type": "contribution"
  }
}
```

---

## POST `/api/v1/income`

**Descripción:** Registra un nuevo ingreso.

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function createIncome(data) {
  // Recibe: id del padre, id del evento (opcional), monto,
  // fecha, descripción y tipo

  // Valida: que el padre exista
  // Valida: que los campos obligatorios estén presentes
  // Valida: que el tipo sea válido (donation, fine, contribution, fee)

  // Procesa: crea el registro de ingreso
  // Crea automáticamente un registro en la tabla de movimientos (tipo: ingreso)

  // Devuelve: el ingreso creado
}
```

**Cuerpo de la solicitud:**
```json
{
  "parent_id": 5,
  "event_id": 1,
  "amount": 2000,
  "date": "2026-04-10",
  "description": "Aporte al festival",
  "type": "contribution"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| parent_id | integer | ✅ | Padre que realizó el pago |
| event_id | integer | No | Evento asociado (nullable) |
| amount | number | ✅ | Monto |
| date | string | ✅ | Fecha (YYYY-MM-DD) |
| description | string | No | Descripción |
| type | string | ✅ | Tipo: donation, fine, contribution, fee |

**Respuesta (201):** Objeto ingreso con `id` y `created_at`.

**Efecto secundario:** Crea un registro correspondiente en la tabla Transaction (type: income).

---

## PUT `/api/v1/income/:id`

**Descripción:** Edita un ingreso.

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function updateIncome(incomeId, data) {
  // Recibe: id del ingreso y campos a actualizar

  // Valida: que el ingreso exista

  // Procesa: actualiza los campos proporcionados

  // Devuelve: el ingreso actualizado
}
```

**Cuerpo de la solicitud:** Igual que POST (todos los campos opcionales).

**Respuesta (200):** Objeto ingreso actualizado.

---

## DELETE `/api/v1/income/:id`

**Descripción:** Elimina un ingreso.

**Actores:** N1

**Pseudocódigo:**
```javascript
function deleteIncome(incomeId) {
  // Recibe: id del ingreso

  // Valida: que el usuario sea administrador (N1)
  // Valida: que el ingreso exista

  // Procesa: elimina el registro de ingreso
  // Elimina o anula el movimiento asociado

  // Devuelve: confirmación de eliminación
}
```

**Respuesta (200):**
```json
{
  "data": {
    "message": "Ingreso eliminado exitosamente"
  }
}
```

---

## GET `/api/v1/parents/:id/income`

**Descripción:** Retorna el historial de ingresos de un padre específico.

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function getParentIncome(parentId, page, limit) {
  // Recibe: id del padre y paginación

  // Consulta: todos los ingresos del padre
  // Ordena: por fecha descendente

  // Devuelve: lista paginada de ingresos del padre
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del padre |

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
      "event_title": "Festival Escolar",
      "amount": 2000,
      "date": "2026-04-10",
      "type": "contribution",
      "description": "Aporte al festival"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "total_pages": 1
  }
}
```

---

## GET `/api/v1/income/totals-panel`

**Descripción:** Retorna totales: recaudado vs pendiente.

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function getIncomeTotals() {
  // Recibe: nada

  // Consulta: todos los ingresos registrados
  // Calcula: total recaudado, total pendiente
  // Agrupa: por tipo de ingreso y por mes

  // Devuelve: resumen de totales con desglose por tipo y mes
}
```

**Respuesta (200):**
```json
{
  "data": {
    "total_collected": 150000,
    "total_pending": 35000,
    "by_type": {
      "donation": 20000,
      "fine": 45000,
      "contribution": 60000,
      "fee": 25000
    },
    "by_month": [
      {
        "month": "2026-01",
        "collected": 12000,
        "pending": 3000
      }
    ]
  }
}
```

---

## GET `/api/v1/parents/:id/financial-status`

**Descripción:** Retorna el estado combinado de ingresos y multas por padre.

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function getFinancialStatus(parentId) {
  // Recibe: id del padre

  // Consulta: todos los ingresos del padre (suma total)
  // Consulta: todas las multas del padre (suma total, pagadas, pendientes)
  // Calcula: balance = ingresos - multas pendientes

  // Devuelve: resumen financiero del padre
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
    "income": {
      "total": 25000,
      "count": 5
    },
    "fines": {
      "total": 10000,
      "pending": 5000,
      "paid": 5000,
      "count": 3
    },
    "balance": 15000
  }
}
```
