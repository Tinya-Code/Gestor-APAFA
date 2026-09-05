# A8 M7 — Request/Response — Multas

### GET `/api/v1/fines`

#### Request

```
GET /api/v1/fines?page=1&limit=20&parent_id=5&paid=false HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

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

### GET `/api/v1/fines/:id`

#### Request

```
GET /api/v1/fines/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

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

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Multa no encontrada"
  }
}
```

---

### POST `/api/v1/fines`

#### Request

```
POST /api/v1/fines HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "parent_id": 5,
  "event_id": 1,
  "amount": 5000
}
```

#### Response 201 Created

```json
{
  "data": {
    "id": 1,
    "parent_id": 5,
    "event_id": 1,
    "amount": 5000,
    "paid": false,
    "generated_date": "2026-04-11",
    "payment_date": null,
    "created_at": "2026-04-11T10:00:00Z"
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

### POST `/api/v1/fines/generate`

#### Request

```
POST /api/v1/fines/generate HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "event_id": 1
}
```

#### Response 200 OK

```json
{
  "data": {
    "generated": 12,
    "event_id": 1,
    "message": "12 multas generadas para padres ausentes"
  }
}
```

#### Response 400 Bad Request

```json
{
  "error": {
    "code": "EVENT_DOES_NOT_GENERATE_FINES",
    "message": "El evento no está configurado para generar multas"
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

### PUT `/api/v1/fines/:id`

#### Request

```
PUT /api/v1/fines/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "amount": 6000,
  "paid": true,
  "payment_date": "2026-05-01"
}
```

#### Response 200 OK

Mismo formato que POST 201.

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Multa no encontrada"
  }
}
```

#### Response 422 Unprocessable Entity

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "payment_date es requerido cuando paid es true"
  }
}
```

---

### DELETE `/api/v1/fines/:id`

#### Request

```
DELETE /api/v1/fines/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "message": "Multa eliminada exitosamente"
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

### GET `/api/v1/parents/:id/fines`

#### Request

```
GET /api/v1/parents/5/fines HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

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

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Padre no encontrado"
  }
}
```
