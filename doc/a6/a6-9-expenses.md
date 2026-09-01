# A6 M9 — Gastos

---

## GET `/api/v1/expenses`

**Descripción:** Lista gastos con filtros.

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function listExpenses(page, limit, type, dateFrom, dateTo) {
  // Recibe: paginación y filtros opcionales (tipo, fecha)

  // Consulta: gastos en la base de datos
  // Aplica filtros si se proporcionan
  // Incluye: número de comprobante y título del evento

  // Devuelve: lista de gastos paginada
}
```

**Parámetros de consulta:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| page | integer | No | Número de página |
| limit | integer | No | Resultados por página |
| type | string | No | Filtrar por tipo (mantenimiento, actividad, etc.) |
| date_from | string | No | Filtrar desde fecha |
| date_to | string | No | Filtrar hasta fecha |

**Respuesta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "event_id": 1,
      "event_title": "Festival Escolar",
      "receipt_id": 1,
      "receipt_number": "FAC-001",
      "board_member_id": 2,
      "total": 15000,
      "type": "activity",
      "date": "2026-04-10",
      "description": "Decoraciones del festival"
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

## GET `/api/v1/expenses/:id`

**Descripción:** Retorna el detalle de un gasto con comprobante e items.

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function getExpense(expenseId) {
  // Recibe: id del gasto

  // Consulta: datos del gasto
  // Consulta: comprobante asociado
  // Consulta: items del comprobante

  // Devuelve: el gasto completo con comprobante e items anidados
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del gasto |

**Respuesta (200):**
```json
{
  "data": {
    "id": 1,
    "event_id": 1,
    "event_title": "Festival Escolar",
    "receipt": {
      "id": 1,
      "board_member_id": 2,
      "number": "FAC-001",
      "type": "invoice",
      "date": "2026-04-10",
      "description": "Suministros de decoración"
    },
    "items": [
      {
        "id": 1,
        "description": "Globos (100 unidades)",
        "amount": 5000
      },
      {
        "id": 2,
        "description": "Cintas y banderines",
        "amount": 3000
      }
    ],
    "total": 15000,
    "type": "activity",
    "date": "2026-04-10",
    "description": "Decoraciones del festival"
  }
}
```

---

## POST `/api/v1/expenses`

**Descripción:** Registra un nuevo gasto.

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function createExpense(data) {
  // Recibe: id del evento (opcional), id del comprobante, total,
  // tipo, fecha y descripción

  // Valida: que el comprobante exista
  // Valida: que los campos obligatorios estén presentes

  // Procesa: crea el registro de gasto
  // Crea automáticamente un registro en la tabla de movimientos (tipo: egreso)

  // Devuelve: el gasto creado
}
```

**Cuerpo de la solicitud:**
```json
{
  "event_id": 1,
  "receipt_id": 1,
  "total": 15000,
  "type": "activity",
  "date": "2026-04-10",
  "description": "Decoraciones del festival"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| event_id | integer | No | Evento asociado (nullable) |
| receipt_id | integer | ✅ | ID del comprobante |
| total | number | ✅ | Monto total |
| type | string | ✅ | Categoría (mantenimiento, actividad, etc.) |
| date | string | ✅ | Fecha (YYYY-MM-DD) |
| description | string | No | Descripción |

**Respuesta (201):** Objeto gasto con `id` y `created_at`.

**Efecto secundario:** Crea un registro correspondiente en la tabla Transaction (type: expense).

---

## PUT `/api/v1/expenses/:id`

**Descripción:** Edita un gasto (reclasificar tipo/fecha).

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function updateExpense(expenseId, data) {
  // Recibe: id del gasto y campos a actualizar

  // Valida: que el gasto exista

  // Procesa: actualiza los campos proporcionados

  // Devuelve: el gasto actualizado
}
```

**Cuerpo de la solicitud:** Igual que POST (todos los campos opcionales).

**Respuesta (200):** Objeto gasto actualizado.

---

## DELETE `/api/v1/expenses/:id`

**Descripción:** Elimina un gasto.

**Actores:** N1

**Pseudocódigo:**
```javascript
function deleteExpense(expenseId) {
  // Recibe: id del gasto

  // Valida: que el usuario sea administrador (N1)
  // Valida: que el gasto exista

  // Procesa: elimina el gasto
  // Elimina o anula el movimiento asociado

  // Devuelve: confirmación de eliminación
}
```

**Respuesta (200):**
```json
{
  "data": {
    "message": "Gasto eliminado exitosamente"
  }
}
```

---

## POST `/api/v1/receipts`

**Descripción:** Registra un nuevo comprobante.

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function createReceipt(data) {
  // Recibe: id del directivo, número, tipo, fecha y descripción

  // Valida: que el directivo exista
  // Valida: que el número de comprobante no esté duplicado

  // Procesa: crea el registro del comprobante

  // Devuelve: el comprobante creado
}
```

**Cuerpo de la solicitud:**
```json
{
  "board_member_id": 2,
  "number": "FAC-001",
  "type": "invoice",
  "date": "2026-04-10",
  "description": "Suministros de decoración"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| board_member_id | integer | ✅ | Directivo responsable |
| number | string | ✅ | Número del comprobante (único) |
| type | string | ✅ | Tipo de comprobante (invoice, ticket, etc.) |
| date | string | ✅ | Fecha de emisión |
| description | string | No | Descripción |

**Respuesta (201):** Objeto comprobante con `id`.

---

## PUT `/api/v1/receipts/:id`

**Descripción:** Edita un comprobante.

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function updateReceipt(receiptId, data) {
  // Recibe: id del comprobante y campos a actualizar

  // Valida: que el comprobante exista

  // Procesa: actualiza los campos proporcionados

  // Devuelve: el comprobante actualizado
}
```

**Cuerpo de la solicitud:** Igual que POST (todos los campos opcionales).

**Respuesta (200):** Objeto comprobante actualizado.

---

## DELETE `/api/v1/receipts/:id`

**Descripción:** Elimina un comprobante.

**Actores:** N1

**Pseudocódigo:**
```javascript
function deleteReceipt(receiptId) {
  // Recibe: id del comprobante

  // Valida: que el usuario sea administrador (N1)
  // Valida: que el comprobante exista

  // Procesa: elimina el comprobante y sus items (CASCADE)

  // Devuelve: confirmación de eliminación
}
```

**Respuesta (200):**
```json
{
  "data": {
    "message": "Comprobante eliminado exitosamente"
  }
}
```

---

## POST `/api/v1/receipts/:id/items`

**Descripción:** Registra un item de gasto sobre un comprobante.

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function createExpenseItem(receiptId, data) {
  // Recibe: id del comprobante, descripción y monto

  // Valida: que el comprobante exista
  // Valida: que la descripción y monto estén presentes

  // Procesa: crea el item vinculado al comprobante

  // Devuelve: el item creado
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del comprobante |

**Cuerpo de la solicitud:**
```json
{
  "description": "Globos (100 unidades)",
  "amount": 5000
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| description | string | ✅ | Descripción del item |
| amount | number | ✅ | Monto del item |

**Respuesta (201):** Objeto item con `id`.

---

## PUT `/api/v1/receipts/:id/items/:itemId`

**Descripción:** Edita un item de gasto.

**Actores:** N1, N2, N3

**Pseudocódigo:**
```javascript
function updateExpenseItem(receiptId, itemId, data) {
  // Recibe: ids de comprobante e item, campos a actualizar

  // Valida: que el item exista en el comprobante

  // Procesa: actualiza los campos del item

  // Devuelve: el item actualizado
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del comprobante |
| itemId | integer | ID del item |

**Cuerpo de la solicitud:** Igual que POST (todos los campos opcionales).

**Respuesta (200):** Objeto item actualizado.

---

## DELETE `/api/v1/receipts/:id/items/:itemId`

**Descripción:** Elimina un item de gasto.

**Actores:** N1

**Pseudocódigo:**
```javascript
function deleteExpenseItem(receiptId, itemId) {
  // Recibe: ids de comprobante e item

  // Valida: que el usuario sea administrador (N1)
  // Valida: que el item exista

  // Procesa: elimina el item del comprobante

  // Devuelve: confirmación de eliminación
}
```

**Respuesta (200):**
```json
{
  "data": {
    "message": "Item de gasto eliminado exitosamente"
  }
}
```
