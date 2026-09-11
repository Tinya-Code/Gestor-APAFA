# API Reference — Gestor APAFA

Complete request/response reference for all implemented endpoints. All routes are prefixed with `/api/v1`.

**Base URL:** `http://localhost:3000/api/v1`

**Authentication:** All endpoints (except `/auth/login`) require `Authorization: Bearer <jwt>` header.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Colegios (Admin)](#2-colegios-admin)
3. [Usuarios (Admin)](#3-usuarios-admin)
4. [Padres](#4-padres)
5. [Estudiantes](#5-estudiantes)
6. [Directiva](#6-directiva)
   - [6.1 Mandatos](#61-mandatos-de-directiva)
   - [6.2 CRUD Operations](#62-crud-operations)
   - [6.3 Reemplazos Temporales](#63-reemplazos-temporales-de-directiva)
7. [Common Patterns](#7-common-patterns)

---

## 1. Authentication

### POST `/auth/login`

Login with Firebase token. Returns JWT with user info and school context.

**Request:**
```
POST /api/v1/auth/login HTTP/1.1
Authorization: Bearer <firebase-id-token>
```

**Response 200 OK (normal user):**
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

**Response 200 OK (super admin):**
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

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `TOKEN_INVALID` | Token de Firebase inválido o expirado |
| 403 | `NOT_AUTHORIZED` | Correo no registrado en el sistema |
| 403 | `NO_COLEGIO` | El usuario no pertenece a ningún colegio |

---

### POST `/auth/logout`

Close session. Returns 200 OK with message.

**Request:**
```
POST /api/v1/auth/logout HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 200 OK:**
```json
{
  "data": {
    "message": "Sesión cerrada exitosamente"
  }
}
```

---

### GET `/auth/me`

Get current user profile with all schools the user belongs to.

**Request:**
```
GET /api/v1/auth/me HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 200 OK (normal user):**
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

**Response 200 OK (super admin):**
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

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `TOKEN_EXPIRED` | Token expirado |

---

### POST `/auth/switch-colegio`

Switch active school. Returns new JWT with updated `colegio_id`.

**Request:**
```
POST /api/v1/auth/switch-colegio HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "colegio_id": 2
}
```

**Response 200 OK:**
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

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 403 | `FORBIDDEN` | Solo el super admin puede cambiar de colegio |
| 404 | `NOT_FOUND` | Colegio no encontrado |

---

### GET `/auth/roles`

List available roles for the current school. Only `super_admin` can access.

**Request:**
```
GET /api/v1/auth/roles HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 200 OK:**
```json
{
  "data": [
    { "name": "presidente", "description": "Presidente de la APAFA" },
    { "name": "vicepresidente", "description": "Vicepresidente de la APAFA" },
    { "name": "tesorero", "description": "Tesorero de la APAFA" },
    { "name": "secretario", "description": "Secretario de la APAFA" },
    { "name": "vocal", "description": "Vocal (solo lectura)" },
    { "name": "padre", "description": "Padre de familia (acceso limitado)" }
  ]
}
```

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 403 | `FORBIDDEN` | Permisos insuficientes |

---

### PUT `/auth/roles/:id`

Assign or update a user's role in the current school. Only `super_admin` can access.

**Request:**
```
PUT /api/v1/auth/roles/5 HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "role": "presidente"
}
```

**Response 200 OK:**
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

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 403 | `FORBIDDEN` | Permisos insuficientes |
| 404 | `NOT_FOUND` | Usuario o colegio no encontrado |

---

## 2. Colegios (Admin)

All endpoints require `super_admin` role.

### GET `/admin/colegios`

List all schools with pagination and search.

**Request:**
```
GET /api/v1/admin/colegios?page=1&limit=20&search=san HTTP/1.1
Authorization: Bearer <jwt>
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `search` | string | - | Search by name or slug |
| `isActive` | boolean | - | Filter by active status |

**Response 200 OK:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Colegio San Miguel",
      "slug": "colegio-san-miguel",
      "address": "Av. Principal 1234",
      "phone": "+5491155550000",
      "email": "info@colegio.edu.ar",
      "logo_url": "https://logo.png",
      "is_active": true,
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 20
  }
}
```

---

### GET `/admin/colegios/:id`

Get a single school by ID.

**Request:**
```
GET /api/v1/admin/colegios/1 HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 200 OK:**
```json
{
  "data": {
    "id": 1,
    "name": "Colegio San Miguel",
    "slug": "colegio-san-miguel",
    "address": "Av. Principal 1234",
    "phone": "+5491155550000",
    "email": "info@colegio.edu.ar",
    "logo_url": "https://logo.png",
    "is_active": true,
    "created_at": "2026-01-15T10:30:00Z"
  }
}
```

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Colegio no encontrado |

---

### POST `/admin/colegios`

Create a new school.

**Request:**
```
POST /api/v1/admin/colegios HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "name": "Colegio San Juan",
  "slug": "colegio-san-juan",
  "address": "Av. Libertador 5678",
  "phone": "+5491155559999",
  "email": "info@colegio-san-juan.edu.ar"
}
```

**Body Fields:**

| Field | Required | Max Length | Description |
|-------|----------|------------|-------------|
| `name` | ✅ | 200 | School name |
| `slug` | ✅ | 100 | URL-friendly identifier (lowercase, numbers, hyphens) |
| `address` | ❌ | 300 | School address |
| `phone` | ❌ | 30 | Phone number |
| `email` | ❌ | 150 | Email address |
| `logo_url` | ❌ | 500 | Logo URL |

**Slug Validation:**
- Lowercase letters, numbers, and hyphens only
- Pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- Must be globally unique

**Response 201 Created:**
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

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 409 | `DUPLICATE` | El slug ya existe |

---

### PUT `/admin/colegios/:id`

Update a school. All fields optional (partial update).

**Request:**
```
PUT /api/v1/admin/colegios/1 HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "name": "Colegio San Miguel Actualizado",
  "phone": "+5491155551111"
}
```

**Response 200 OK:**
```json
{
  "data": {
    "id": 1,
    "name": "Colegio San Miguel Actualizado",
    "slug": "colegio-san-miguel",
    "address": "Av. Principal 1234",
    "phone": "+5491155551111",
    "email": "info@colegio.edu.ar",
    "logo_url": null,
    "is_active": true,
    "created_at": "2026-01-15T10:30:00Z"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Colegio no encontrado |
| 409 | `DUPLICATE` | El slug ya existe |

---

### DELETE `/admin/colegios/:id`

Soft delete a school. Fails if school has associated users.

**Request:**
```
DELETE /api/v1/admin/colegios/1 HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 204 No Content**

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 409 | `HAS_ASSOCIATED_USERS` | No se puede eliminar colegio con usuarios asociados |

---

## 3. Usuarios (Admin)

All endpoints require `super_admin` role.

### GET `/admin/usuarios`

List all users with pagination.

**Request:**
```
GET /api/v1/admin/usuarios?page=1&limit=20&search=juan HTTP/1.1
Authorization: Bearer <jwt>
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `search` | string | - | Search by name, email, or surname |

**Response 200 OK:**
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
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

---

### GET `/admin/usuarios/:id`

Get a single user by ID.

**Request:**
```
GET /api/v1/admin/usuarios/2 HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 200 OK:**
```json
{
  "data": {
    "id": 2,
    "email": "juan.perez@email.com",
    "name": "Juan",
    "surname": "Pérez",
    "is_super_admin": false
  }
}
```

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Usuario no encontrado |

---

### POST `/admin/usuarios/:id/colegios`

Assign a user to a school with a role.

**Request:**
```
POST /api/v1/admin/usuarios/5/colegios HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "role": "tesorero"
}
```

**Body Fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `role` | ✅ | Role to assign (presidente, vicepresidente, tesorero, secretario, vocal, padre) |

**Response 201 Created:**
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

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Usuario o colegio no encontrado |
| 409 | `DUPLICATE` | El usuario ya pertenece a este colegio |

---

### DELETE `/admin/usuarios/:id/colegios/:colegioId`

Remove a user from a school. Hard delete (no undo).

**Request:**
```
DELETE /api/v1/admin/usuarios/5/colegios/1 HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 204 No Content**

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Relación no encontrada |

---

### DELETE `/admin/usuarios/:id`

Soft delete a user. Fails for super admin or users with associated parents.

**Request:**
```
DELETE /api/v1/admin/usuarios/2 HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 204 No Content**

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 409 | `CANNOT_DELETE_SUPER_ADMIN` | No se puede eliminar el super admin |
| 409 | `HAS_ASSOCIATED_PARENTS` | No se puede eliminar usuario con padres asociados |

---

## 4. Padres

Multi-tenant endpoints. All queries filtered by `colegio_id` from JWT.

### GET `/parents`

List parents in the current school with pagination and search.

**Request:**
```
GET /api/v1/parents?page=1&limit=20&search=garcia HTTP/1.1
Authorization: Bearer <jwt>
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 100) |
| `search` | string | - | Search by name, surname, or DNI |

**Response 200 OK:**
```json
{
  "data": [
    {
      "id": 1,
      "colegio_id": 1,
      "usuario_id": null,
      "name": "María",
      "surname": "García",
      "dni": "30123456",
      "phone": "+54 11 2345-6789",
      "email": "maria@ejemplo.com",
      "created_at": "2026-01-15T10:30:00Z",
      "updated_at": "2026-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20
  }
}
```

---

### GET `/parents/:id`

Get a single parent by ID.

**Request:**
```
GET /api/v1/parents/1 HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 200 OK:**
```json
{
  "data": {
    "id": 1,
    "colegio_id": 1,
    "usuario_id": null,
    "name": "María",
    "surname": "García",
    "dni": "30123456",
    "phone": "+54 11 2345-6789",
    "email": "maria@ejemplo.com",
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-01-15T10:30:00Z"
  }
}
```

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Padre no encontrado |

---

### POST `/parents`

Create a new parent in the current school.

**Request:**
```
POST /api/v1/parents HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "name": "María",
  "surname": "García",
  "dni": "30123456",
  "phone": "+54 11 2345-6789",
  "email": "maria@ejemplo.com"
}
```

**Body Fields:**

| Field | Required | Max Length | Description |
|-------|----------|------------|-------------|
| `name` | ✅ | 100 | First name |
| `surname` | ✅ | 100 | Last name |
| `dni` | ✅ | 20 | DNI (unique per school) |
| `phone` | ❌ | 30 | Phone number |
| `email` | ❌ | 150 | Email address |
| `usuario_id` | ❌ | - | Associated user ID (if registered) |

**Response 201 Created:**
```json
{
  "data": {
    "id": 1,
    "colegio_id": 1,
    "usuario_id": null,
    "name": "María",
    "surname": "García",
    "dni": "30123456",
    "phone": "+54 11 2345-6789",
    "email": "maria@ejemplo.com",
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-01-15T10:30:00Z"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 409 | `CONFLICT` | Ya existe un padre con este DNI en el colegio |

---

### PUT `/parents/:id`

Update a parent. Partial update (only sent fields).

**Request:**
```
PUT /api/v1/parents/1 HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "name": "María Elena",
  "phone": "+54 11 9999-0000"
}
```

**Response 200 OK:**
```json
{
  "data": {
    "id": 1,
    "colegio_id": 1,
    "usuario_id": null,
    "name": "María Elena",
    "surname": "García",
    "dni": "30123456",
    "phone": "+54 11 9999-0000",
    "email": "maria@ejemplo.com",
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-09-07T00:00:00Z"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Padre no encontrado |
| 409 | `CONFLICT` | Ya existe un padre con este DNI en el colegio |

---

### DELETE `/parents/:id`

Soft delete a parent. Fails if parent has associated students.

**Request:**
```
DELETE /api/v1/parents/1 HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 204 No Content**

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 403 | `FORBIDDEN` | No se puede eliminar un padre que tiene hijos registrados |
| 404 | `NOT_FOUND` | Padre no encontrado |

---

## 5. Estudiantes

Multi-tenant endpoints. All queries filtered by `colegio_id` from JWT.

### GET `/students`

List students in the current school with pagination and filters.

**Request:**
```
GET /api/v1/students?page=1&limit=20&grade=3ro&section=A HTTP/1.1
Authorization: Bearer <jwt>
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 100) |
| `search` | string | - | Search by name or surname |
| `grade` | string | - | Filter by grade |
| `section` | string | - | Filter by section |

**Response 200 OK:**
```json
{
  "data": [
    {
      "id": 1,
      "colegio_id": 1,
      "name": "Sofía",
      "surname": "García",
      "grade": "3ro",
      "section": "A",
      "parent_id": 1,
      "created_at": "2026-01-15T10:30:00Z",
      "updated_at": "2026-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 20
  }
}
```

---

### GET `/students/:id`

Get a single student by ID.

**Request:**
```
GET /api/v1/students/1 HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 200 OK:**
```json
{
  "data": {
    "id": 1,
    "colegio_id": 1,
    "name": "Sofía",
    "surname": "García",
    "grade": "3ro",
    "section": "A",
    "parent_id": 1,
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-01-15T10:30:00Z"
  }
}
```

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Estudiante no encontrado |

---

### POST `/students`

Create a new student in the current school.

**Request:**
```
POST /api/v1/students HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "name": "Sofía",
  "surname": "García",
  "grade": "3ro",
  "section": "A",
  "parent_id": 1
}
```

**Body Fields:**

| Field | Required | Max Length | Description |
|-------|----------|------------|-------------|
| `name` | ✅ | 100 | First name |
| `surname` | ✅ | 100 | Last name |
| `grade` | ✅ | 50 | Grade (e.g., "3ro", "4to") |
| `section` | ❌ | 50 | Section (e.g., "A", "B") |
| `parent_id` | ✅ | - | Parent ID (must exist in same school) |

**Response 201 Created:**
```json
{
  "data": {
    "id": 1,
    "colegio_id": 1,
    "name": "Sofía",
    "surname": "García",
    "grade": "3ro",
    "section": "A",
    "parent_id": 1,
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-01-15T10:30:00Z"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Padre no encontrado |

---

### PUT `/students/:id`

Update a student. Partial update (only sent fields).

**Request:**
```
PUT /api/v1/students/1 HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "grade": "4to",
  "section": "B"
}
```

**Response 200 OK:**
```json
{
  "data": {
    "id": 1,
    "colegio_id": 1,
    "name": "Sofía",
    "surname": "García",
    "grade": "4to",
    "section": "B",
    "parent_id": 1,
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-09-07T00:00:00Z"
  }
}
```

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Estudiante no encontrado |

---

### DELETE `/students/:id`

Soft delete a student.

**Request:**
```
DELETE /api/v1/students/1 HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 204 No Content**

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Estudiante no encontrado |

---

## 6. Directiva

Multi-tenant endpoints. All queries filtered by `colegio_id` from JWT.

### GET `/directiva`

List board members in the current school with pagination.

**Request:**
```
GET /api/v1/directiva?page=1&limit=20 HTTP/1.1
Authorization: Bearer <jwt>
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |

**Response 200 OK:**
```json
{
  "data": [
    {
      "id": 1,
      "colegio_id": 1,
      "parent_id": 1,
      "role": "presidente",
      "start_date": "2025-03-01",
      "end_date": "2026-03-01",
      "is_active": true,
      "notes": "Mandato 2025-2026",
      "created_at": "2026-01-15T10:30:00Z",
      "updated_at": "2026-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 6,
    "page": 1,
    "limit": 20
  }
}
```

---

### GET `/directiva/:id`

Get a single board member assignment by ID.

**Request:**
```
GET /api/v1/directiva/1 HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 200 OK:**
```json
{
  "data": {
    "id": 1,
    "colegio_id": 1,
    "parent_id": 1,
    "role": "presidente",
    "start_date": "2025-03-01",
    "end_date": "2026-03-01",
    "is_active": true,
    "notes": "Mandato 2025-2026",
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-01-15T10:30:00Z"
  }
}
```

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Mandato no encontrado |

---

### POST `/directiva`

Assign a parent to the board (create mandate). Only one active mandate per parent per school.

**Request:**
```
POST /api/v1/directiva HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "parent_id": 1,
  "role": "presidente",
  "start_date": "2025-03-01",
  "end_date": "2026-03-01",
  "notes": "Mandato 2025-2026"
}
```

**Body Fields:**

| Field | Required | Max Length | Description |
|-------|----------|------------|-------------|
| `parent_id` | ✅ | - | Parent ID (must exist in same school) |
| `role` | ✅ | 50 | Role: presidente, vicepresidente, tesorero, secretario, vocal |
| `start_date` | ✅ | - | Mandate start date (YYYY-MM-DD) |
| `end_date` | ❌ | - | Mandate end date (NULL = active/current) |
| `notes` | ❌ | 500 | Additional notes |

**Response 201 Created:**
```json
{
  "data": {
    "id": 1,
    "colegio_id": 1,
    "parent_id": 1,
    "role": "presidente",
    "start_date": "2025-03-01",
    "end_date": "2026-03-01",
    "is_active": true,
    "notes": "Mandato 2025-2026",
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-01-15T10:30:00Z"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Padre no encontrado |
| 409 | `CONFLICT` | Este usuario ya tiene un cargo activo en la directiva |

---

### PUT `/directiva/:id`

Update a board member assignment. Partial update.

**Request:**
```
PUT /api/v1/directiva/1 HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "end_date": "2026-06-01",
  "notes": "Mandato extendido"
}
```

**Response 200 OK:**
```json
{
  "data": {
    "id": 1,
    "colegio_id": 1,
    "parent_id": 1,
    "role": "presidente",
    "start_date": "2025-03-01",
    "end_date": "2026-06-01",
    "is_active": true,
    "notes": "Mandato extendido",
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-09-07T00:00:00Z"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Mandato no encontrado |
| 409 | `CONFLICT` | Conflicto de fechas o rol |

---

### DELETE `/directiva/:id`

Soft delete a board member assignment.

**Request:**
```
DELETE /api/v1/directiva/1 HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 200 OK:**
```json
{
  "data": {
    "message": "Mandato eliminado exitosamente"
  }
}
```

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Mandato no encontrado |

---

## 6.3 Reemplazos Temporales de Directiva

### GET `/directiva/reemplazos`

Listar reemplazos del colegio con filtros y paginación.

**Request:**
```
GET /api/v1/directiva/reemplazos HTTP/1.1
Authorization: Bearer <jwt>
```

**Query Parameters (opcionales):**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Número de página |
| `limit` | number | 10 | Elementos por página (máx 100) |
| `replaced_role` | string | - | Filtrar por rol reemplazado |
| `vocal_parent_id` | number | - | Filtrar por vocal que reemplaza |
| `is_active` | boolean | - | Solo reemplazos activos |
| `current` | boolean | - | Solo reemplazos vigentes |

**Ejemplo:**
```
GET /api/v1/directiva/reemplazos?current=true&is_active=true HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 200 OK:**
```json
{
  "data": [
    {
      "id": 1,
      "colegio_id": 1,
      "vocal_parent_id": 3,
      "vocal_name": "Carlos",
      "vocal_surname": "López",
      "replaced_role": "tesorero",
      "replaced_parent_id": 2,
      "replaced_name": "María",
      "replaced_surname": "Gómez",
      "effective_role": "tesorero",
      "start_date": "2025-09-07T10:00:00Z",
      "end_date": "2025-09-14T18:00:00Z",
      "reason": "Tesorera con licencia médica por una semana",
      "is_active": 1,
      "created_by_name": "Juan",
      "created_by_surname": "Pérez",
      "created_at": "2025-09-07T09:00:00Z",
      "updated_at": "2025-09-07T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "total_pages": 1
  }
}
```

---

### GET `/directiva/reemplazos/:id`

Obtener un reemplazo por ID.

**Request:**
```
GET /api/v1/directiva/reemplazos/1 HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 200 OK:**
```json
{
  "data": {
    "id": 1,
    "colegio_id": 1,
    "vocal_parent_id": 3,
    "vocal_name": "Carlos",
    "vocal_surname": "López",
    "replaced_role": "tesorero",
    "replaced_parent_id": 2,
    "replaced_name": "María",
    "replaced_surname": "Gómez",
    "effective_role": "tesorero",
    "start_date": "2025-09-07T10:00:00Z",
    "end_date": "2025-09-14T18:00:00Z",
    "reason": "Tesorera con licencia médica por una semana",
    "is_active": 1,
    "created_by_name": "Juan",
    "created_by_surname": "Pérez",
    "created_at": "2025-09-07T09:00:00Z",
    "updated_at": "2025-09-07T09:00:00Z"
  }
}
```

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Reemplazo no encontrado |

---

### POST `/directiva/reemplazos`

Crear un reemplazo temporal. Solo presidente o super_admin pueden autorizar.

**Request:**
```
POST /api/v1/directiva/reemplazos HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "vocal_parent_id": 3,
  "replaced_role": "tesorero",
  "replaced_parent_id": 2,
  "start_date": "2025-09-07T10:00:00",
  "end_date": "2025-09-14T18:00:00",
  "reason": "Tesorera con licencia médica por una semana"
}
```

**Body Fields:**

| Field | Required | Type | Max Length | Description |
|-------|----------|------|------------|-------------|
| `vocal_parent_id` | ✅ | number | - | ID del padre vocal que reemplazará |
| `replaced_role` | ✅ | string | 50 | Rol reemplazado: `vicepresidente`, `tesorero` o `secretario` |
| `replaced_parent_id` | ✅ | number | - | ID del padre directivo que será reemplazado |
| `start_date` | ✅ | string | - | Fecha/hora inicio (ISO 8601: `YYYY-MM-DDTHH:MM:SS`) |
| `end_date` | ❌ | string | - | Fecha/hora fin (ISO 8601). NULL = indefinido |
| `reason` | ❌ | string | 500 | Motivo del reemplazo |

**Response 201 Created:**
```json
{
  "data": {
    "id": 1,
    "colegio_id": 1,
    "vocal_parent_id": 3,
    "vocal_name": "Carlos",
    "vocal_surname": "López",
    "replaced_role": "tesorero",
    "replaced_parent_id": 2,
    "replaced_name": "María",
    "replaced_surname": "Gómez",
    "effective_role": "tesorero",
    "start_date": "2025-09-07T10:00:00Z",
    "end_date": "2025-09-14T18:00:00Z",
    "reason": "Tesorera con licencia médica por una semana",
    "is_active": 1,
    "created_by_name": "Juan",
    "created_by_surname": "Pérez",
    "created_at": "2025-09-07T09:00:00Z",
    "updated_at": "2025-09-07T09:00:00Z"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | El padre indicado no es vocal activo en este colegio |
| 404 | `NOT_FOUND` | No se encontró un directivo activo con rol X para reemplazar |
| 409 | `CONFLICT` | El vocal no puede reemplazarse a sí mismo |
| 409 | `CONFLICT` | Ya existe un reemplazo activo para el rol X |
| 409 | `CONFLICT` | Este vocal ya tiene un reemplazo activo |
| 409 | `CONFLICT` | La fecha de fin debe ser posterior a la fecha de inicio |

---

### PUT `/directiva/reemplazos/:id`

Actualizar un reemplazo (extender fecha, cambiar motivo, desactivar). Solo presidente o super_admin.

**Request:**
```
PUT /api/v1/directiva/reemplazos/1 HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "end_date": "2025-09-21T18:00:00",
  "reason": "Extensión por recuperación de la tesorera"
}
```

**Body Fields (todos opcionales):**

| Field | Type | Description |
|-------|------|-------------|
| `end_date` | string | Nueva fecha de fin (ISO 8601) |
| `reason` | string | Motivo actualizado |
| `is_active` | boolean | `false` para desactivar manualmente |

**Response 200 OK:**
```json
{
  "data": {
    "id": 1,
    "colegio_id": 1,
    "vocal_parent_id": 3,
    "vocal_name": "Carlos",
    "vocal_surname": "López",
    "replaced_role": "tesorero",
    "replaced_parent_id": 2,
    "replaced_name": "María",
    "replaced_surname": "Gómez",
    "effective_role": "tesorero",
    "start_date": "2025-09-07T10:00:00Z",
    "end_date": "2025-09-21T18:00:00Z",
    "reason": "Extensión por recuperación de la tesorera",
    "is_active": 1,
    "created_by_name": "Juan",
    "created_by_surname": "Pérez",
    "created_at": "2025-09-07T09:00:00Z",
    "updated_at": "2025-09-14T12:00:00Z"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Reemplazo no encontrado |
| 409 | `CONFLICT` | El reemplazo ya está inactivo |
| 409 | `CONFLICT` | La fecha de fin debe ser posterior a la fecha de inicio |

---

### DELETE `/directiva/reemplazos/:id`

Finalizar un reemplazo (el vocal vuelve a solo lectura). Solo presidente o super_admin.

**Request:**
```
DELETE /api/v1/directiva/reemplazos/1 HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 200 OK:**
```json
{
  "data": {
    "message": "Reemplazo finalizado exitosamente"
  }
}
```

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Reemplazo no encontrado |

---

## 7. Common Patterns

### Pagination

All list endpoints support pagination via query parameters:

```
GET /api/v1/resource?page=1&limit=20
```

**Response format:**
```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
```

**Limits:**
- Default page: 1
- Default limit: 20 (some endpoints use 10)
- Maximum limit: 100 (enforced by backend)

### Error Response Format

All errors follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message in Spanish"
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate, constraint violation) |
| 422 | Unprocessable Entity (validation error) |
| 500 | Internal Server Error |

### Soft Delete

All domain tables use soft delete (`deleted_at` field):

- `DELETE /resource/:id` sets `deleted_at = NOW()`
- Subsequent `GET` queries automatically exclude soft-deleted records
- No undo — confirm with user before deleting

### Multi-Tenant Isolation

All domain endpoints automatically filter by `colegio_id` from the JWT:

- User cannot access data from other schools
- `colegio_id` is extracted from JWT in the `@ColegioId()` decorator
- Frontend does NOT need to pass `colegio_id` in requests

### RolesGuard Behavior

- **Super admin bypass:** `is_super_admin === true` → always allowed
- **Vocal with active replacement:** When a vocal has an active temporary replacement, their `effective_role` changes to the role they're replacing (e.g., `tesorero`). This is automatic — no logout/login needed.
- Frontend should still hide/show UI elements based on role for UX

### Validation Errors

When validation fails (422 Unprocessable Entity):

```json
{
  "statusCode": 422,
  "message": ["name should not be empty", "dni must be a string"],
  "error": "Unprocessable Entity"
}
```

Or with custom validation:

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
