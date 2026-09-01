# A6 M1 — Autenticación y Roles

---

## POST `/api/v1/auth/login`

**Descripción:** Autentica un usuario y retorna un token JWT.

**Actores:** N1–N5

**Pseudocódigo:**
```javascript
function login(email, password) {
  // Recibe: email y contraseña del usuario

  // Valida: que el email exista en la base de datos
  // y que la contraseña coincida con el hash almacenado

  // Procesa: genera un token JWT con el id del usuario,
  // su rol y una fecha de expiración

  // Devuelve: el token JWT y los datos básicos del usuario
  // (id, nombre, apellido, rol)
}
```

**Cuerpo de la solicitud:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "string"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| email | string | ✅ | Email del usuario |
| password | string | ✅ | Contraseña del usuario |

**Respuesta (200):**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
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

**Errores:**
| Código | Descripción |
|--------|-------------|
| 401 | Credenciales inválidas |
| 422 | Error de validación (campos faltantes) |

---

## POST `/api/v1/auth/logout`

**Descripción:** Invalida el token de sesión actual.

**Actores:** N1–N5

**Pseudocódigo:**
```javascript
function logout(token) {
  // Recibe: el token JWT de la sesión activa

  // Procesa: agrega el token a una lista de tokens revocados
  // para que no pueda usarse nuevamente

  // Devuelve: confirmación de cierre de sesión
}
```

**Encabezados:**
```
Authorization: Bearer <token>
```

**Cuerpo de la solicitud:** Ninguno

**Respuesta (200):**
```json
{
  "data": {
    "message": "Sesión cerrada exitosamente"
  }
}
```

**Errores:**
| Código | Descripción |
|--------|-------------|
| 401 | Token inválido o expirado |

---

## GET `/api/v1/auth/me`

**Descripción:** Retorna el perfil y rol del usuario autenticado.

**Actores:** N1–N5

**Pseudocódigo:**
```javascript
function getMe(token) {
  // Recibe: el token JWT de la sesión activa

  // Valida: que el token sea válido y no esté expirado
  // Decodifica: el id del usuario del token

  // Consulta: los datos completos del usuario en la base de datos
  // incluyendo su rol y si está vinculado a un padre o directivo

  // Devuelve: el perfil completo del usuario con su rol
}
```

**Encabezados:**
```
Authorization: Bearer <token>
```

**Cuerpo de la solicitud:** Ninguno

**Respuesta (200):**
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

**Errores:**
| Código | Descripción |
|--------|-------------|
| 401 | Token inválido o expirado |

---

## GET `/api/v1/roles`

**Descripción:** Lista todos los roles disponibles en el sistema.

**Actores:** N1

**Pseudocódigo:**
```javascript
function getRoles() {
  // Recibe: nada (solo requiere autenticación de administrador)

  // Valida: que el usuario tenga rol de administrador (N1)

  // Consulta: todos los roles registrados en el sistema

  // Devuelve: lista de roles con id, nombre y descripción
}
```

**Encabezados:**
```
Authorization: Bearer <token>
```

**Cuerpo de la solicitud:** Ninguno

**Respuesta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "admin",
      "description": "Acceso total al sistema"
    },
    {
      "id": 2,
      "name": "president",
      "description": "Presidente de la directiva"
    },
    {
      "id": 3,
      "name": "treasurer",
      "description": "Operaciones financieras"
    },
    {
      "id": 4,
      "name": "secretary",
      "description": "Solo lectura + asistencias"
    },
    {
      "id": 5,
      "name": "parent",
      "description": "Acceso de padre"
    }
  ]
}
```

**Errores:**
| Código | Descripción |
|--------|-------------|
| 403 | Permisos insuficientes |

---

## PUT `/api/v1/roles/:id`

**Descripción:** Asigna o edita el rol de un usuario.

**Actores:** N1

**Pseudocódigo:**
```javascript
function updateRole(roleId, userId, newRole) {
  // Recibe: id del rol, id del usuario y nuevo rol a asignar

  // Valida: que el usuario tenga permisos de administrador (N1)
  // Valida: que el rol exista en el sistema
  // Valida: que el usuario exista

  // Procesa: actualiza la asignación de rol del usuario
  // Registra en auditoría quién hizo el cambio

  // Devuelve: la asignación de rol actualizada con fecha de modificación
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del rol |

**Cuerpo de la solicitud:**
```json
{
  "user_id": 5,
  "role": "treasurer"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| user_id | integer | ✅ | Usuario al que asignar el rol |
| role | string | ✅ | Nombre del rol (admin, president, treasurer, secretary, parent) |

**Respuesta (200):**
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

**Errores:**
| Código | Descripción |
|--------|-------------|
| 403 | Permisos insuficientes |
| 404 | Rol o usuario no encontrado |
| 422 | Error de validación |
