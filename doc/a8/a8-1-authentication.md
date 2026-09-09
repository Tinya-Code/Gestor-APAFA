# A8 M1 — Request/Response — Autenticación y Roles (Multi-Tenant)

## POST `/api/v1/auth/login`

### Request

```
POST /api/v1/auth/login HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs... (token de Firebase/Google)

// No hay body — el token viene en el header
```

### Response 200 OK (usuario normal)

```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 86400,
    "user": {
      "id": 2,
      "email": "juan.perez@email.com",
      "name": "Juan",
      "surname": "Pérez",
      "role": "presidente",
      "colegio_id": 1,
      "colegio_name": "Colegio San Miguel",
      "is_super_admin": false
    }
  }
}
```

### Response 200 OK (super_admin)

```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 86400,
    "user": {
      "id": 1,
      "email": "dev@gestor-apafa.com",
      "name": "Admin",
      "surname": "Sistema",
      "role": "admin",
      "colegio_id": null,
      "colegio_name": null,
      "is_super_admin": true
    }
  }
}
```

### Response 401 Unauthorized

```json
{
  "error": {
    "code": "TOKEN_INVALID",
    "message": "Token de Firebase inválido o expirado"
  }
}
```

### Response 403 Forbidden

```json
{
  "error": {
    "code": "NOT_AUTHORIZED",
    "message": "Correo no registrado en el sistema"
  }
}
```

### Response 403 Forbidden (sin colegio)

```json
{
  "error": {
    "code": "NO_COLEGIO",
    "message": "El usuario no pertenece a ningún colegio"
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

---

## GET `/api/v1/auth/me`

### Request

```
GET /api/v1/auth/me HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response 200 OK (usuario normal)

```json
{
  "data": {
    "id": 2,
    "email": "juan.perez@email.com",
    "name": "Juan",
    "surname": "Pérez",
    "phone": "+5491155551234",
    "role": "presidente",
    "colegio_id": 1,
    "colegio_name": "Colegio San Miguel",
    "is_super_admin": false
  }
}
```

### Response 200 OK (super_admin)

```json
{
  "data": {
    "id": 1,
    "email": "dev@gestor-apafa.com",
    "name": "Admin",
    "surname": "Sistema",
    "phone": null,
    "role": "admin",
    "colegio_id": null,
    "colegio_name": null,
    "is_super_admin": true
  }
}
```

### Response 401 Unauthorized

```json
{
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Token expirado"
  }
}
```

---

## POST `/api/v1/auth/switch-colegio` (solo super_admin)

### Request

```
POST /api/v1/auth/switch-colegio HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "colegio_id": 2
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
      "email": "dev@gestor-apafa.com",
      "name": "Admin",
      "surname": "Sistema",
      "role": "admin",
      "colegio_id": 2,
      "colegio_name": "Colegio San Juan",
      "is_super_admin": true
    }
  }
}
```

### Response 403 Forbidden (no es super_admin)

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Solo el super admin puede cambiar de colegio"
  }
}
```

### Response 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Colegio no encontrado"
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
    { "name": "admin_colegio", "description": "Administrador del colegio" },
    { "name": "presidente", "description": "Presidente de la APAFA" },
    { "name": "vicepresidente", "description": "Vicepresidente de la APAFA" },
    { "name": "tesorero", "description": "Tesorero de la APAFA" },
    { "name": "secretario", "description": "Secretario de la APAFA" },
    { "name": "vocal", "description": "Vocal (solo lectura)" },
    { "name": "padre", "description": "Padre de familia (acceso limitado)" }
  ]
}
```

---

## PUT `/api/v1/roles/:id`

### Request

```
PUT /api/v1/roles/5 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "role": "presidente"
}
```

### Response 200 OK

```json
{
  "data": {
    "id": 5,
    "usuario_id": 2,
    "colegio_id": 1,
    "role": "presidente",
    "updated_at": "2026-09-07T00:00:00.000Z"
  }
}
```

### Response 403 Forbidden (no es admin ni admin_colegio)

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Permisos insuficientes"
  }
}
```

---

## POST `/api/v1/admin/colegios` (solo super_admin)

### Request

```
POST /api/v1/admin/colegios HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "name": "Colegio San Juan",
  "slug": "colegio-san-juan",
  "address": "Av. Libertador 5678",
  "phone": "+5491155559999",
  "email": "info@colegio-san-juan.edu.ar"
}
```

### Response 201 Created

```json
{
  "data": {
    "id": 2,
    "name": "Colegio San Juan",
    "slug": "colegio-san-juan",
    "address": "Av. Libertador 5678",
    "phone": "+5491155559999",
    "email": "info@colegio-san-juan.edu.ar",
    "logo_url": null,
    "is_active": true,
    "created_at": "2026-09-07T00:00:00.000Z"
  }
}
```

### Response 409 Conflict (slug duplicado)

```json
{
  "error": {
    "code": "DUPLICATE",
    "message": "El slug ya existe"
  }
}
```

---

## GET `/api/v1/admin/usuarios` (solo super_admin)

### Request

```
GET /api/v1/admin/usuarios HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response 200 OK

```json
{
  "data": [
    {
      "id": 1,
      "email": "dev@gestor-apafa.com",
      "name": "Admin",
      "surname": "Sistema",
      "is_super_admin": true
    },
    {
      "id": 2,
      "email": "juan.perez@email.com",
      "name": "Juan",
      "surname": "Pérez",
      "is_super_admin": false
    }
  ]
}
```

---

## POST `/api/v1/admin/usuarios/:id/colegios` (solo super_admin)

### Request

```
POST /api/v1/admin/usuarios/5/colegios HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "role": "tesorero"
}
```

### Response 201 Created

```json
{
  "data": {
    "id": 10,
    "usuario_id": 5,
    "colegio_id": 1,
    "role": "tesorero",
    "created_at": "2026-09-07T00:00:00.000Z"
  }
}
```

### Response 409 Conflict (ya pertenece al colegio)

```json
{
  "error": {
    "code": "DUPLICATE",
    "message": "El usuario ya pertenece a este colegio"
  }
}
```
