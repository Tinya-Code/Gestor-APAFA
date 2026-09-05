# A8 M3 — Request/Response — Directiva

### GET `/api/v1/board-members`

#### Request

```
GET /api/v1/board-members?page=1&limit=20 HTTP/1.1
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
      "role": "president",
      "start_date": "2025-03-01",
      "end_date": null
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

### GET `/api/v1/board-members/:id`

#### Request

```
GET /api/v1/board-members/1 HTTP/1.1
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
      "surname": "López",
      "dni": "28765432"
    },
    "role": "president",
    "start_date": "2025-03-01",
    "end_date": null
  }
}
```

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Miembro de directiva no encontrado"
  }
}
```

---

### POST `/api/v1/board-members`

#### Request

```
POST /api/v1/board-members HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "parent_id": 5,
  "role": "president",
  "start_date": "2025-03-01"
}
```

#### Response 201 Created

```json
{
  "data": {
    "id": 1,
    "parent_id": 5,
    "role": "president",
    "start_date": "2025-03-01",
    "end_date": null,
    "created_at": "2026-01-15T10:30:00Z"
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

#### Response 409 Conflict

```json
{
  "error": {
    "code": "ROLE_OCCUPIED",
    "message": "Ya existe un miembro activo con el rol president"
  }
}
```

#### Response 422 Unprocessable Entity

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El padre no existe"
  }
}
```

---

### PUT `/api/v1/board-members/:id`

#### Request

```
PUT /api/v1/board-members/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "end_date": "2026-03-01"
}
```

#### Response 200 OK

Mismo formato que POST 201.

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Miembro de directiva no encontrado"
  }
}
```

---

### DELETE `/api/v1/board-members/:id`

#### Request

```
DELETE /api/v1/board-members/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "message": "Miembro de directiva eliminado exitosamente"
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

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Miembro de directiva no encontrado"
  }
}
```
