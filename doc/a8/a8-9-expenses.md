# A8 M9 — Request/Response — Gastos

### GET `/api/v1/expenses`

#### Request

```
GET /api/v1/expenses?page=1&limit=20&category=materials HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": [
    {
      "id": 1,
      "category": "materials",
      "amount": 25000,
      "description": "Material para Festival",
      "transaction_date": "2026-04-08",
      "evidence_url": "https://...",
      "event_id": 1,
      "event_title": "Festival Escolar"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 35,
    "total_pages": 2
  }
}
```

---

### GET `/api/v1/expenses/:id`

#### Request

```
GET /api/v1/expenses/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "id": 1,
    "category": "materials",
    "amount": 25000,
    "description": "Material para Festival",
    "transaction_date": "2026-04-08",
    "evidence_url": "https://...",
    "event_id": 1,
    "event": {
      "id": 1,
      "title": "Festival Escolar"
    },
    "created_at": "2026-04-08T10:00:00Z"
  }
}
```

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Gasto no encontrado"
  }
}
```

---

### POST `/api/v1/expenses`

#### Request

```
POST /api/v1/expenses HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "category": "materials",
  "amount": 25000,
  "description": "Material para Festival",
  "transaction_date": "2026-04-08",
  "evidence_url": "https://...",
  "event_id": 1
}
```

#### Response 201 Created

```json
{
  "data": {
    "id": 1,
    "category": "materials",
    "amount": 25000,
    "description": "Material para Festival",
    "transaction_date": "2026-04-08",
    "evidence_url": "https://...",
    "event_id": 1,
    "created_at": "2026-04-08T10:00:00Z"
  }
}
```

#### Response 403 Forbidden

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Permisos insuficientes"
  }
}
```

#### Response 422 Unprocessable Entity

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El monto debe ser mayor a 0"
  }
}
```

---

### PUT `/api/v1/expenses/:id`

#### Request

```
PUT /api/v1/expenses/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "amount": 28000,
  "description": "Material para Festival (corregido)"
}
```

#### Response 200 OK

Mismo formato que POST 201.

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Gasto no encontrado"
  }
}
```

---

### DELETE `/api/v1/expenses/:id`

#### Request

```
DELETE /api/v1/expenses/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "message": "Gasto eliminado exitosamente"
  }
}
```

#### Response 403 Forbidden

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Permisos insuficientes"
  }
}
```

---

### POST `/api/v1/expenses/event`

#### Request

```
POST /api/v1/expenses/event HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "event_id": 1,
  "category": "materials",
  "amount": 25000,
  "description": "Material para Festival"
}
```

#### Response 201 Created

```json
{
  "data": {
    "id": 1,
    "event_id": 1,
    "category": "materials",
    "amount": 25000,
    "description": "Material para Festival",
    "created_at": "2026-04-08T10:00:00Z"
  }
}
```

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Evento no encontrado"
  }
}
```

---

### GET `/api/v1/expenses/event/:eventId`

#### Request

```
GET /api/v1/expenses/event/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "event_id": 1,
    "event_title": "Festival Escolar",
    "total_expenses": 120000,
    "expenses": [
      {
        "id": 1,
        "category": "materials",
        "amount": 25000,
        "description": "Material para Festival"
      }
    ]
  }
}
```

---

### PUT `/api/v1/expenses/event/:eventId/:expenseId`

#### Request

```
PUT /api/v1/expenses/event/1/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "category": "supplies",
  "amount": 30000
}
```

#### Response 200 OK

Mismo formato que POST 201.

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Gasto de evento no encontrado"
  }
}
```

---

### DELETE `/api/v1/expenses/event/:eventId/:expenseId`

#### Request

```
DELETE /api/v1/expenses/event/1/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "message": "Gasto de evento eliminado exitosamente"
  }
}
```

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Gasto de evento no encontrado"
  }
}
```

---

### POST `/api/v1/expenses/fixed`

#### Request

```
POST /api/v1/expenses/fixed HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "category": "maintenance",
  "amount": 15000,
  "description": "Mantenimiento general"
}
```

#### Response 201 Created

```json
{
  "data": {
    "id": 2,
    "category": "maintenance",
    "amount": 15000,
    "description": "Mantenimiento general",
    "type": "fixed",
    "created_at": "2026-04-08T10:00:00Z"
  }
}
```

---

### GET `/api/v1/expenses/fixed`

#### Request

```
GET /api/v1/expenses/fixed HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": [
    {
      "id": 2,
      "category": "maintenance",
      "amount": 15000,
      "description": "Mantenimiento general",
      "created_at": "2026-04-08T10:00:00Z"
    }
  ]
}
```

---

### GET `/api/v1/expenses/summary`

#### Request

```
GET /api/v1/expenses/summary?date_from=2026-01-01&date_to=2026-12-31 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "total_expenses": 800000,
    "by_category": [
      { "category": "materials", "amount": 300000, "count": 12 },
      { "category": "services", "amount": 250000, "count": 8 },
      { "category": "maintenance", "amount": 150000, "count": 10 },
      { "category": "other", "amount": 100000, "count": 5 }
    ],
    "by_type": [
      { "type": "event", "amount": 500000, "count": 20 },
      { "type": "fixed", "amount": 300000, "count": 15 }
    ],
    "date_from": "2026-01-01",
    "date_to": "2026-12-31"
  }
}
```
