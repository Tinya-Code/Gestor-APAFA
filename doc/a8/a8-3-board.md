# A8 M3 — Request/Response — Directiva (Multi-Tenant)

> **Multi-Tenant:** Todos los responses incluyen `colegio_id` del token JWT.

## Super Admin — Acceso Multi-Colegio

El super_admin (`is_super_admin=true`) tiene acceso especial:

| Escenario | Comportamiento |
|---|---|
| Sin `colegio_id` | Ve TODOS los registros de TODOS los colegios |
| Con `?colegio_id=N` | Ve solo registros del colegio N |
| Admin de colegio (no super) | Ve solo registros de su colegio (del JWT) |

---

### GET `/api/v1/directiva`

#### Request (admin de colegio)

```
GET /api/v1/directiva?page=1&limit=20 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Request (super_admin — todos los colegios)

```
GET /api/v1/directiva?page=1&limit=20 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...  ← token con is_super_admin=true
```

#### Request (super_admin — colegio específico)

```
GET /api/v1/directiva?page=1&limit=20&colegio_id=1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...  ← token con is_super_admin=true
```

#### Response 200 OK

```json
{
  "data": [
    {
      "id": 1,
      "parent_id": 5,
      "parent_name": "Carlos López",
      "role": "presidente",
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

### GET `/api/v1/directiva/:id`

#### Request (admin de colegio)

```
GET /api/v1/directiva/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Request (super_admin — colegio específico)

```
GET /api/v1/directiva/1?colegio_id=2 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...  ← token con is_super_admin=true
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
    "role": "presidente",
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
    "role": "presidente",
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
    "message": "Ya existe un miembro activo con el rol presidente"
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
