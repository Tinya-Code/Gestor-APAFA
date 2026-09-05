# A8 M2 — Request/Response — Padres y Estudiantes

## Padres

### GET `/api/v1/parents`

#### Request

```
GET /api/v1/parents?page=1&limit=20&search=garcia HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": [
    {
      "id": 1,
      "name": "María",
      "surname": "García",
      "dni": "30123456",
      "phone": "+54 11 2345-6789",
      "email": "maria@ejemplo.com",
      "students_count": 2
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

### GET `/api/v1/parents/:id`

#### Request

```
GET /api/v1/parents/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "id": 1,
    "name": "María",
    "surname": "García",
    "dni": "30123456",
    "phone": "+54 11 2345-6789",
    "email": "maria@ejemplo.com",
    "students": [
      {
        "id": 1,
        "name": "Sofía",
        "surname": "García",
        "grade": "3ro",
        "section": "A"
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

---

### POST `/api/v1/parents`

#### Request

```
POST /api/v1/parents HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "name": "María",
  "surname": "García",
  "dni": "30123456",
  "phone": "+54 11 2345-6789",
  "email": "maria@ejemplo.com"
}
```

#### Response 201 Created

```json
{
  "data": {
    "id": 1,
    "name": "María",
    "surname": "García",
    "dni": "30123456",
    "phone": "+54 11 2345-6789",
    "email": "maria@ejemplo.com",
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

#### Response 422 Unprocessable Entity

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El DNI ya está registrado",
    "details": [
      { "field": "dni", "message": "El DNI ya está registrado" }
    ]
  }
}
```

---

### PUT `/api/v1/parents/:id`

#### Request

```
PUT /api/v1/parents/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "name": "María Elena",
  "phone": "+54 11 9999-0000"
}
```

#### Response 200 OK

Mismo formato que POST 201.

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Padre no encontrado"
  }
}
```

#### Response 422 Unprocessable Entity

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El DNI ya está registrado"
  }
}
```

---

### DELETE `/api/v1/parents/:id`

#### Request

```
DELETE /api/v1/parents/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "message": "Padre eliminado exitosamente"
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
    "code": "HAS_ACTIVE_CHILDREN",
    "message": "No se puede eliminar padre con estudiantes activos"
  }
}
```

---

## Estudiantes

### GET `/api/v1/students`

#### Request

```
GET /api/v1/students?page=1&limit=20&grade=3ro&section=A HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": [
    {
      "id": 1,
      "name": "Sofía",
      "surname": "García",
      "grade": "3ro",
      "section": "A",
      "parent_id": 1,
      "parent_name": "María García"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 120,
    "total_pages": 6
  }
}
```

---

### GET `/api/v1/students/:id`

#### Request

```
GET /api/v1/students/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "id": 1,
    "name": "Sofía",
    "surname": "García",
    "grade": "3ro",
    "section": "A",
    "parent_id": 1,
    "parent": {
      "id": 1,
      "name": "María",
      "surname": "García"
    }
  }
}
```

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Estudiante no encontrado"
  }
}
```

---

### POST `/api/v1/students`

#### Request

```
POST /api/v1/students HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "name": "Sofía",
  "surname": "García",
  "grade": "3ro",
  "section": "A",
  "parent_id": 1
}
```

#### Response 201 Created

```json
{
  "data": {
    "id": 1,
    "name": "Sofía",
    "surname": "García",
    "grade": "3ro",
    "section": "A",
    "parent_id": 1,
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

### PUT `/api/v1/students/:id`

#### Request

```
PUT /api/v1/students/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "grade": "4to",
  "section": "B"
}
```

#### Response 200 OK

Mismo formato que POST 201.

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Estudiante no encontrado"
  }
}
```

---

### DELETE `/api/v1/students/:id`

#### Request

```
DELETE /api/v1/students/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response 200 OK

```json
{
  "data": {
    "message": "Estudiante eliminado exitosamente"
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

### PATCH `/api/v1/students/:id/parent`

#### Request

```
PATCH /api/v1/students/1/parent HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "parent_id": 3
}
```

#### Response 200 OK

Mismo formato que POST 201 con nuevo parent_id.

#### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Estudiante o padre no encontrado"
  }
}
```
