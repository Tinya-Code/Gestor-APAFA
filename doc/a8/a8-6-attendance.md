# A8 M6 — Request/Response — Asistencias

### GET `/api/v1/events/:id/attendance`

#### Request

```
GET /api/v1/events/1/attendance?page=1&limit=20 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

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

### POST `/api/v1/events/:id/attendance`

#### Request

```
POST /api/v1/events/1/attendance HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "parent_id": 5,
  "attended": true
}
```

#### Response 201 Created

```json
{
  "data": {
    "id": 1,
    "event_id": 1,
    "parent_id": 5,
    "attended": true,
    "registration_date": "2026-04-10",
    "created_at": "2026-04-10T14:30:00Z"
  }
}
```

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Evento o padre no encontrado"
  }
}
```

#### Response 422 Unprocessable Entity

```json
{
  "error": {
    "code": "DUPLICATE_ATTENDANCE",
    "message": "Ya existe un registro de asistencia para este padre en este evento"
  }
}
```

---

### PUT `/api/v1/events/:id/attendance/:attendanceId`

#### Request

```
PUT /api/v1/events/1/attendance/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "attended": false
}
```

#### Response 200 OK

Mismo formato que POST 201.

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Registro de asistencia no encontrado"
  }
}
```
