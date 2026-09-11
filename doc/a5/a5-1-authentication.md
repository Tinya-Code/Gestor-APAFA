# M1 / F1 — Autenticación y Roles (Multi-Tenant)

**Entidades:** Usuario, UsuarioColegio, Colegio

> **Modelo Multi-Tenant:** El JWT incluye `colegio_id` e `is_super_admin`.
> El backend filtra todas las queries por `colegio_id` del token.

---

## Backend — Endpoints REST

### Autenticación (Multi-Tenant)

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 1 | POST | `/api/v1/auth/login` | Inicia sesión, retorna token JWT con colegio_id | N0–N5 | Iniciar sesión |
| 2 | POST | `/api/v1/auth/logout` | Cierra sesión / invalida token | N0–N5 | Cerrar sesión |
| 3 | GET | `/api/v1/auth/me` | Retorna perfil, rol y colegio del usuario autenticado | N0–N5 | Ver perfil |
| 4 | POST | `/api/v1/auth/switch-colegio` | Cambia de colegio (solo super_admin) | N0 | Cambiar colegio |

### Gestión de Roles (por colegio)

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 5 | GET | `/api/v1/roles` | Lista roles disponibles DEL COLEGIO | N0, N1 | Gestionar roles |
| 6 | PUT | `/api/v1/roles/:id` | Asigna/edita rol de un usuario EN EL COLEGIO | N0, N1 | Gestionar roles |

### Panel Super Admin (acceso global)

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 7 | GET | `/api/v1/admin/colegios` | Lista TODOS los colegios | N0 | Gestionar colegios |
| 8 | POST | `/api/v1/admin/colegios` | Crea un colegio | N0 | Crear colegio |
| 9 | GET | `/api/v1/admin/usuarios` | Lista TODOS los usuarios | N0 | Gestionar usuarios |
| 10 | POST | `/api/v1/admin/usuarios/:id/colegios` | Asigna usuario a un colegio con rol | N0 | Asignar a colegio |

---

## JWT — Estructura del Token

```json
{
  "sub": 123,                    // usuario_id
  "email": "juan@email.com",
  "role": "presidente",          // Rol EN el colegio
  "colegio_id": 1,               // ID del colegio activo
  "is_super_admin": false,       // true solo para N0
  "iat": 1725000000,
  "exp": 1725086400
}
```

### Super Admin (N0)

```json
{
  "sub": 1,
  "email": "dev@gestor-apafa.com",
  "role": "admin",
  "colegio_id": null,            // Sin colegio (acceso global)
  "is_super_admin": true,        // Bypass total
  "iat": 1725000000,
  "exp": 1725086400
}
```

---

## Frontend — Pantallas y Componentes

### Pantallas

| # | Pantalla | Actores | Consume |
|---|----------|---------|---------|
| 1 | Login | N0–N5 | `POST /auth/login` |
| 2 | Logout (acción) | N0–N5 | `POST /auth/logout` |
| 3 | Selector de Colegio | N0 | `GET /admin/colegios`, `POST /auth/switch-colegio` |
| 4 | Gestión de Roles (por colegio) | N0, N1 | `GET /roles`, `PUT /roles/:id` |
| 5 | Gestión de Usuarios (global) | N0 | `GET /admin/usuarios` |
| 6 | Asignar Usuario a Colegio | N0 | `POST /admin/usuarios/:id/colegios` |

### Desglose de Componentes

| Componente | Tipo | Consume | Descripción |
|------------|------|---------|-------------|
| Botón Login Google | Acción | `POST /auth/login` | Inicia sesión con Google Sign-In, envía token Firebase en header |
| Botón Logout | Acción | `POST /auth/logout` | Cierra sesión, frontend descarta token |
| Selector de Colegio | Selector | `GET /admin/colegios` | Para super_admin: elegir qué colegio gestionar |
| Lista de Roles | Tabla | `GET /roles` | Muestra los roles disponibles DEL COLEGIO actual |
| Editor de Roles | Formulario | `PUT /roles/:id` | Editar asignación de rol para un usuario EN EL COLEGIO |
| Lista de Usuarios | Tabla | `GET /admin/usuarios` | Para super_admin: todos los usuarios del sistema |
| Formulario Asignación | Formulario | `POST /admin/usuarios/:id/colegios` | Asignar usuario a colegio con rol específico |

---

## Casos de Uso (de A4)

| Caso de Uso | N0 | N1 | N2 | N3 | N4 | N5 | N6 |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Iniciar sesión | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Cerrar sesión | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Ver perfil | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Cambiar de colegio | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Gestionar roles (por colegio) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Gestionar colegios (global) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Gestionar usuarios (global) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Asignar usuario a colegio | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Notas de Implementación

### Flujo de Login Multi-Tenant

```
1. Frontend envía token de Firebase al backend
2. Backend verifica con Firebase → obtiene email
3. Backend busca usuario en tabla 'usuario' por email
4. Backend busca en 'usuario_colegio' → obtiene role + colegio_id
5. Backend genera JWT con: sub, email, role, colegio_id, is_super_admin
6. Frontend almacena JWT y datos del usuario
7. Todas las subsiguientes peticiones incluyen el JWT
8. Backend filtra todas las queries por colegio_id del JWT
```

### Super Admin (N0)

- `is_super_admin = true` en JWT
- `colegio_id = null` en JWT
- Puede acceder a `/api/v1/admin/*` (endpoints globales)
- Puede usar `switch-colegio` para ver datos de un colegio específico
- **NUNCA** aparece en listados de padres o directiva

### Super Admin

- `is_super_admin = true` en tabla `usuario`
- Acceso total a TODOS los colegios
- Bypass de RolesGuard (no necesita permisos específicos)
- Puede gestionar roles en cualquier colegio
