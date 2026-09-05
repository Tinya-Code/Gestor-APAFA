# A8 M11 — Request/Response — Avisos

### GET `/api/v1/notices`

#### Request

```
GET /api/v1/notices?page=1&limit=20&type=event HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": [
    {
      "id": 1,
      "type": "event",
      "reference_id": 1,
      "title": "Nuevo evento: Festival Escolar",
      "message": "Se creó el evento Festival Escolar para el 10/04/2026",
      "date": "2026-04-10",
      "read": false
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

### GET `/api/v1/notices/:id`

#### Request

```
GET /api/v1/notices/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "id": 1,
    "type": "event",
    "reference_id": 1,
    "title": "Nuevo evento: Festival Escolar",
    "message": "Se creó el evento Festival Escolar para el 10/04/2026",
    "date": "2026-04-10",
    "read": false,
    "created_at": "2026-04-10T08:00:00Z"
  }
}
```

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Aviso no encontrado"
  }
}
```
