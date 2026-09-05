# A8 M8 — Request/Response — Ingresos

### GET `/api/v1/income`

#### Request

```
GET /api/v1/income?page=1&limit=20&category=membership HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": [
    {
      "id": 1,
      "category": "membership",
      "amount": 50000,
      "description": "Cuota mensual marzo",
      "transaction_date": "2026-03-01",
      "source": "parent",
      "source_id": 5,
      "source_name": "Carlos López"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

---

### GET `/api/v1/income/:id`

#### Request

```
GET /api/v1/income/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "id": 1,
    "category": "membership",
    "amount": 50000,
    "description": "Cuota mensual marzo",
    "transaction_date": "2026-03-01",
    "source": "parent",
    "source_id": 5,
    "source_name": "Carlos López",
    "created_at": "2026-03-01T10:00:00Z"
  }
}
```

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Ingreso no encontrado"
  }
}
```

---

### POST `/api/v1/income`

#### Request

```
POST /api/v1/income HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "category": "membership",
  "amount": 50000,
  "description": "Cuota mensual marzo",
  "transaction_date": "2026-03-01",
  "source": "parent",
  "source_id": 5
}
```

#### Response 201 Created

```json
{
  "data": {
    "id": 1,
    "category": "membership",
    "amount": 50000,
    "description": "Cuota mensual marzo",
    "transaction_date": "2026-03-01",
    "source": "parent",
    "source_id": 5,
    "created_at": "2026-03-01T10:00:00Z"
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

### PUT `/api/v1/income/:id`

#### Request

```
PUT /api/v1/income/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "amount": 55000,
  "description": "Cuota mensual marzo (corregida)"
}
```

#### Response 200 OK

Mismo formato que POST 201.

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Ingreso no encontrado"
  }
}
```

---

### DELETE `/api/v1/income/:id`

#### Request

```
DELETE /api/v1/income/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "message": "Ingreso eliminado exitosamente"
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

### POST `/api/v1/income/pay-fine`

#### Request

```
POST /api/v1/income/pay-fine HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "fine_id": 1,
  "amount": 5000,
  "transaction_date": "2026-05-01"
}
```

#### Response 201 Created

```json
{
  "data": {
    "fine_id": 1,
    "income_id": 2,
    "amount": 5000,
    "paid": true,
    "payment_date": "2026-05-01",
    "message": "Multa pagada y registrada como ingreso"
  }
}
```

#### Response 400 Bad Request

```json
{
  "error": {
    "code": "ALREADY_PAID",
    "message": "La multa ya está pagada"
  }
}
```

#### Response 422 Unprocessable Entity

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El monto del pago no coincide con el monto de la multa"
  }
}
```

---

### POST `/api/v1/income/contribution`

#### Request

```
POST /api/v1/income/contribution HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "event_id": 1,
  "parent_id": 5,
  "amount": 2000,
  "transaction_date": "2026-04-10"
}
```

#### Response 201 Created

```json
{
  "data": {
    "event_id": 1,
    "parent_id": 5,
    "income_id": 3,
    "amount": 2000,
    "message": "Contribución registrada como ingreso"
  }
}
```

#### Response 422 Unprocessable Entity

```json
{
  "error": {
    "code": "DUPLICATE_CONTRIBUTION",
    "message": "Ya existe una contribución de este padre para este evento"
  }
}
```

---

### GET `/api/v1/income/summary`

#### Request

```
GET /api/v1/income/summary?date_from=2026-01-01&date_to=2026-12-31 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "total_income": 2500000,
    "by_category": [
      { "category": "membership", "amount": 1500000, "count": 30 },
      { "category": "event", "amount": 500000, "count": 25 },
      { "category": "fine", "amount": 300000, "count": 15 },
      { "category": "other", "amount": 200000, "count": 5 }
    ],
    "date_from": "2026-01-01",
    "date_to": "2026-12-31"
  }
}
```
