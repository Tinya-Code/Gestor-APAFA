# A7 M1 — DTOs — Autenticación y Roles

## Login

**#1 — POST /auth/login** — Iniciar sesión — Retorna: Token + Usuario

**Reglas de dominio**

- El email debe tener formato válido (RFC 5322 simplificado)
- La contraseña no puede estar vacía
- Firebase Auth valida credenciales; si falla, se retorna 401 sin exponer detalles
- Si el usuario no existe localmente pero Firebase lo autentica, se crea automáticamente
- El token JWT interno expira en 24 horas

```ts
// Entrada
interface LoginDto {
  email: string;
  password: string;
}

// Salida
interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    email: string;
    name: string;
    surname: string;
    role: string;
  };
}
```

---

## Logout

**#2 — POST /auth/logout** — Cerrar sesión — Retorna: Mensaje

**Reglas de dominio**

- El token debe ser válido y no estar en la blacklist
- La revocación es inmediata

```ts
// Entrada: Ninguna (usa token del header)

// Salida
interface LogoutResponse {
  message: string;
}
```

---

## Perfil

**#3 — GET /auth/me** — Obtener perfil del usuario — Retorna: Datos

**Reglas de dominio**

- Requiere autenticación válida
- Retorna el perfil completo incluyendo vínculo a padre o directivo

```ts
// Entrada: Ninguna (usa token del header)

// Salida
interface PerfilResponse {
  id: number;
  email: string;
  name: string;
  surname: string;
  dni: string;
  phone: string;
  role: string;
  parent_id: number | null;
  board_member_id: number | null;
}
```

---

## Roles

**#4 — GET /roles** — Listar roles — Retorna: Datos

**Reglas de dominio**

- Solo administradores (N1) pueden listar roles
- Lista estática del sistema: admin, president, vice_president, treasurer, secretary, parent

```ts
// Entrada: Ninguna

// Salida
interface Rol {
  id: number;
  name: string;
  description: string;
}

type ListarRolesResponse = Rol[];
```

---

## Asignar Rol

**#5 — PUT /roles/:id** — Asignar/editar rol — Retorna: Datos

**Reglas de dominio**

- Solo administradores (N1) pueden asignar roles
- El rol debe existir en el sistema
- El usuario destino debe existir

```ts
// Entrada
interface AsignarRolDto {
  user_id: number;
  role: string;
}

// Salida
interface AsignarRolResponse {
  id: number;
  user_id: number;
  role: string;
  updated_at: string;
}
```
