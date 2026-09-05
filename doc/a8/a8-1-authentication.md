# A8 M1 — Request/Response — Autenticación y Roles

## POST `/api/v1/auth/login`

### Request

```
POST /api/v1/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "MiContraseña123!"
}
```

### Response 200 OK

```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 86400,
    "user": {
      "id": 1,
      "email": "usuario@ejemplo.com",
      "name": "Juan",
      "surname": "Pérez",
      "role": "admin"
    }
  }
}
```

### Response 401 Unauthorized

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Credenciales inválidas"
  }
}
```

### Response 422 Unprocessable Entity

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El email es requerido",
    "details": [
      { "field": "email", "message": "El email es requerido" }
    ]
  }
}
```

### Response 502 Bad Gateway

```json
{
  "error": {
    "code": "FIREBASE_ERROR",
    "message": "Error al conectar con el servicio de autenticación"
  }
}
```

---

## POST `/api/v1/auth/logout`

### Request

```
POST /api/v1/auth/logout HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response 200 OK

```json
{
  "data": {
    "message": "Sesión cerrada exitosamente"
  }
}
```

### Response 401 Unauthorized

```json
{
  "error": {
    "code": "TOKEN_INVALID",
    "message": "Token inválido o expirado"
  }
}
```

---

## GET `/api/v1/auth/me`

### Request

```
GET /api/v1/auth/me HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response 200 OK

```json
{
  "data": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "name": "Juan",
    "surname": "Pérez",
    "dni": "12345678",
    "phone": "+54 11 1234-5678",
    "role": "admin",
    "parent_id": null,
    "board_member_id": null
  }
}
```

### Response 401 Unauthorized

```json
{
  "error": {
    "code": "TOKEN_INVALID",
    "message": "Token inválido o expirado"
  }
}
```

---

## GET `/api/v1/roles`

### Request

```
GET /api/v1/roles HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response 200 OK

```json
{
  "data": [
    { "id": 1, "name": "admin", "description": "Acceso total al sistema" },
    { "id": 2, "name": "president", "description": "Presidente de la directiva" },
    { "id": 3, "name": "vice_president", "description": "Vicepresidente de la directiva" },
    { "id": 4, "name": "treasurer", "description": "Operaciones financieras" },
    { "id": 5, "name": "secretary", "description": "Solo lectura + asistencias" },
    { "id": 6, "name": "parent", "description": "Acceso de padre" }
  ]
}
```

### Response 403 Forbidden

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Permisos insuficientes"
  }
}
```

---

## PUT `/api/v1/roles/:id`

### Request

```
PUT /api/v1/roles/4 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "user_id": 5,
  "role": "treasurer"
}
```

### Response 200 OK

```json
{
  "data": {
    "id": 1,
    "user_id": 5,
    "role": "treasurer",
    "updated_at": "2026-01-15T10:30:00Z"
  }
}
```

### Response 403 Forbidden

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Permisos insuficientes"
  }
}
```

### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Rol o usuario no encontrado"
  }
}
```
