# M1 / F1 — Autenticación y Roles

**Entidades:** User (ligado a Parent/BoardMember), Role

---

## Backend — Endpoints REST

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 1 | POST | `/api/v1/auth/login` | Inicia sesión, retorna token JWT | N1–N5 | Iniciar sesión |
| 2 | POST | `/api/v1/auth/logout` | Cierra sesión / invalida token | N1–N5 | Cerrar sesión |
| 3 | GET | `/api/v1/auth/me` | Retorna perfil y rol del usuario autenticado | N1–N5 | Iniciar sesión |
| 4 | GET | `/api/v1/roles` | Lista roles disponibles | N1 | Gestionar roles |
| 5 | PUT | `/api/v1/roles/:id` | Asigna/edita rol de un usuario | N1 | Gestionar roles |

---

## Frontend — Pantallas y Componentes

### Pantallas

| # | Pantalla | Actores | Consume |
|---|----------|---------|---------|
| 1 | Login | N1–N5 | `POST /auth/login` |
| 2 | Logout (acción) | N1–N5 | `POST /auth/logout` |
| 3 | Gestión de roles | N1 | `GET /roles`, `PUT /roles/:id` |

### Desglose de Componentes

| Componente | Tipo | Consume | Descripción |
|------------|------|---------|-------------|
| Formulario Login | Formulario | `POST /auth/login` | Campos de email y contraseña, envío dispara autenticación |
| Botón Logout | Acción | `POST /auth/logout` | Invalida el token de sesión actual |
| Lista de Roles | Tabla | `GET /roles` | Muestra los roles disponibles del sistema |
| Editor de Roles | Formulario | `PUT /roles/:id` | Editar asignación de rol para un usuario |

---

## Casos de Uso (de A4)

| Caso de Uso | N1 | N2 | N3 | N4 | N5 | N6 |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|
| Iniciar sesión | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Cerrar sesión | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Gestionar roles | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
