# A7 M1 — DTOs — Autenticación y Roles (Multi-Tenant)

## Login

**#1 — POST /auth/login** — Iniciar sesión — Retorna: Token + Usuario + Colegio

**Reglas de dominio**

- El login se hace exclusivamente con token de Firebase (Google Sign-In)
- No hay formulario de email/password
- El token viene en el header Authorization: "Bearer <firebase-token>"
- Firebase Admin SDK valida el token; si falla, se retorna 401
- Se busca el email del token en la tabla `usuario`
- Se busca en `usuario_colegio` para obtener el rol y colegio
- Si el usuario no tiene colegio → 403
- El token JWT interno expira en 24 horas
- El JWT incluye: `sub`, `email`, `role`, `colegio_id`, `is_super_admin`

```ts
// Entrada: Ninguna — el token viene en el header Authorization
// No hay LoginDto con email/password

// Salida
interface LoginResponse {
  access_token: string;
  token_type: string;           // "Bearer"
  expires_in: number;           // 86400
  user: {
    id: number;
    email: string;
    name: string;
    surname: string;
    role: string;               // Rol EN el colegio
    colegio_id: number;         // ID del colegio activo
    colegio_name: string;       // Nombre del colegio
    is_super_admin: boolean;    // true solo para N0
  };
}
```

---

## Logout

**#2 — POST /auth/logout** — Cerrar sesión — Retorna: Mensaje

**Reglas de dominio**

- No se usa blacklist
- El token expira naturalmente después de 24 horas
- El frontend descarta el token al hacer logout

```ts
// Entrada: Ninguna

// Salida
interface LogoutResponse {
  message: string;              // "Sesión cerrada exitosamente"
}
```

---

## Perfil

**#3 — GET /auth/me** — Obtener perfil — Retorna: Datos + Colegio

**Reglas de dominio**

- Valida firma y expiración del JWT
- Si es super_admin → retorna perfil sin colegio
- Si no es super_admin → busca en `usuario_colegio` para obtener rol y nombre del colegio
- Si no pertenece al colegio del token → 403

```ts
// Entrada: Ninguna (viene del JWT)

// Salida (usuario normal)
interface ProfileResponse {
  id: number;
  email: string;
  name: string;
  surname: string;
  phone: string | null;
  role: string;                 // Rol en el colegio
  colegio_id: number;
  colegio_name: string;
  is_super_admin: false;
}

// Salida (super_admin)
interface SuperAdminProfileResponse {
  id: number;
  email: string;
  name: string;
  surname: string;
  phone: string | null;
  role: "admin";
  colegio_id: null;
  colegio_name: null;
  is_super_admin: true;
}
```

---

## Switch Colegio (solo super_admin)

**#4 — POST /auth/switch-colegio** — Cambiar de colegio — Retorna: Nuevo JWT

**Reglas de dominio**

- Solo el super_admin (N0) puede usar este endpoint
- El colegio debe existir y estar activo
- Genera un nuevo JWT con el colegio_id seleccionado

```ts
// Entrada
interface SwitchColegioDto {
  colegio_id: number;           // ID del colegio al que quiere cambiar
}

// Salida
interface SwitchColegioResponse {
  access_token: string;         // Nuevo JWT con el colegio_id actualizado
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    email: string;
    name: string;
    surname: string;
    role: string;
    colegio_id: number;
    Colegio_name: string;
    is_super_admin: boolean;
  };
}
```

---

## Asignar Rol

**#5 — PUT /roles/:id** — Asignar/editar rol — Retorna: Datos

**Reglas de dominio**

- Solo N0 (super_admin) o N1 (admin_colegio) pueden asignar roles
- El super_admin puede asignar en cualquier colegio
- El admin_colegio solo puede asignar EN SU colegio
- El rol debe ser válido: admin_colegio, presidente, vicepresidente, tesorero, secretario, vocal, padre

```ts
// Entrada
interface AsignarRolDto {
  role: string;                 // Rol a asignar (ver lista de roles válidos)
  colegio_id?: number;          // Solo para super_admin: si quiere asignar en otro colegio
}

// Salida
interface AsignarRolResponse {
  id: number;                   // ID de la relación usuario_colegio
  usuario_id: number;
  colegio_id: number;
  role: string;
  updated_at: string;
}
```

---

## Crear Colegio (solo super_admin)

**#6 — POST /admin/colegios** — Crear colegio — Retorna: Datos

**Reglas de dominio**

- Solo el super_admin (N0) puede crear colegios
- `name` y `slug` son obligatorios
- `slug` debe ser único (URL-friendly)

```ts
// Entrada
interface CreateColegioDto {
  name: string;                 // Nombre del colegio
  slug: string;                 // URL-friendly (ej: "colegio-san-miguel")
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
}

// Salida
interface ColegioResponse {
  id: number;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
}
```

---

## Asignar Usuario a Colegio (solo super_admin)

**#7 — POST /admin/usuarios/:id/colegios** — Asignar usuario a colegio — Retorna: Datos

**Reglas de dominio**

- Solo el super_admin (N0) puede asignar usuarios a colegios
- El usuario y el colegio deben existir
- El rol debe ser válido
- El usuario no puede estar duplicado en el mismo colegio

```ts
// Entrada
interface AssignColegioDto {
  role: string;                 // Rol del usuario en ese colegio
}

// Salida
interface AssignColegioResponse {
  id: number;
  usuario_id: number;
  colegio_id: number;
  role: string;
  created_at: string;
}
```
