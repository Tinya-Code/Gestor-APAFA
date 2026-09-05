# A8 M5 — Request/Response — Eventos

### GET `/api/v1/events`

#### Request

```
GET /api/v1/events?page=1&limit=20&date_from=2026-01-01&date_to=2026-12-31 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

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

### GET `/api/v1/events/:id`

#### Request

```
GET /api/v1/events/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

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

### POST `/api/v1/events`

#### Request

```
POST /api/v1/events HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

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

#### Response 201 Created

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
    "message": "Si genera multa, el monto debe ser mayor a 0",
    "details": [
      { "field": "fine_amount", "message": "Debe ser > 0 cuando generates_fine es true" }
    ]
  }
}
```

---

### PUT `/api/v1/events/:id`

#### Request

```
PUT /api/v1/events/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "title": "Festival Escolar 2026",
  "fine_amount": 7000
}
```

#### Response 200 OK

Mismo formato que POST 201.

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

### DELETE `/api/v1/events/:id`

#### Request

```
DELETE /api/v1/events/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "message": "Evento eliminado exitosamente"
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
