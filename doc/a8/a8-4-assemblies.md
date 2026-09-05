# A8 M4 — Request/Response — Asambleas

## Asambleas

### GET `/api/v1/assemblies`

#### Request

```
GET /api/v1/assemblies?page=1&limit=20&date_from=2026-01-01&date_to=2026-12-31 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": [
    {
      "id": 1,
      "title": "Asamblea Anual 2026",
      "date": "2026-03-15",
      "description": "Revisión anual y aprobación de presupuesto",
      "details_count": 3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "total_pages": 1
  }
}
```

---

### GET `/api/v1/assemblies/:id`

#### Request

```
GET /api/v1/assemblies/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "id": 1,
    "title": "Asamblea Anual 2026",
    "date": "2026-03-15",
    "description": "Revisión anual y aprobación de presupuesto",
    "details": [
      {
        "id": 1,
        "description": "Presupuesto anual aprobado: $50.000",
        "registration_date": "2026-03-15",
        "image_url": "https://..."
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
    "message": "Asamblea no encontrada"
  }
}
```

---

### POST `/api/v1/assemblies`

#### Request

```
POST /api/v1/assemblies HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "title": "Asamblea Anual 2026",
  "date": "2026-03-15",
  "description": "Revisión anual y aprobación de presupuesto"
}
```

#### Response 201 Created

```json
{
  "data": {
    "id": 1,
    "title": "Asamblea Anual 2026",
    "date": "2026-03-15",
    "description": "Revisión anual y aprobación de presupuesto",
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

---

### PUT `/api/v1/assemblies/:id`

#### Request

```
PUT /api/v1/assemblies/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "title": "Asamblea Anual 2026 - Modificada"
}
```

#### Response 200 OK

Mismo formato que POST 201.

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Asamblea no encontrada"
  }
}
```

---

### DELETE `/api/v1/assemblies/:id`

#### Request

```
DELETE /api/v1/assemblies/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "message": "Asamblea eliminada exitosamente"
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

## Detalles de Asamblea

### POST `/api/v1/assemblies/:id/details`

#### Request

```
POST /api/v1/assemblies/1/details HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "description": "Presupuesto anual aprobado: $50.000",
  "image_url": "https://..."
}
```

#### Response 201 Created

```json
{
  "data": {
    "id": 1,
    "assembly_id": 1,
    "description": "Presupuesto anual aprobado: $50.000",
    "registration_date": "2026-03-15",
    "image_url": "https://...",
    "created_at": "2026-01-15T10:30:00Z"
  }
}
```

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Asamblea no encontrada"
  }
}
```

---

### PUT `/api/v1/assemblies/:id/details/:detailId`

#### Request

```
PUT /api/v1/assemblies/1/details/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "description": "Presupuesto anual aprobado: $55.000 (modificado)"
}
```

#### Response 200 OK

Mismo formato que POST 201.

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Detalle de asamblea no encontrado"
  }
}
```

---

### DELETE `/api/v1/assemblies/:id/details/:detailId`

#### Request

```
DELETE /api/v1/assemblies/1/details/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "message": "Detalle de asamblea eliminado exitosamente"
  }
}
```

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Detalle de asamblea no encontrado"
  }
}
```
