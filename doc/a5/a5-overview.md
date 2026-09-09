# A5 — Resumen General: Backend, Endpoints y Frontend (Multi-Tenant)

Separación por módulos basada en la matriz de accesos de casos de uso (A4) y el modelo de entidades (A2).

> **Modelo Multi-Tenant:** Todos los endpoints filtran por `colegio_id` del token JWT.
> El super_admin accede a todos los colegios desde un panel especial.

---

## Actores

| Código | Actor | Descripción | Alcance |
|--------|-------|-------------|---------|
| N0 | Super Admin (desarrollador) | Acceso TOTAL a TODOS los colegios | Global (sin colegio_id) |
| N1 | Admin de Colegio | Acceso total EN SU colegio | Por colegio |
| N2 | Presidente / Vicepresidente | Acceso completo excepto panel de tesorero | Por colegio |
| N3 | Tesorero | Acceso a operaciones financieras | Por colegio |
| N4 | Secretario / Vocal | Asistencias, asambleas y solo lectura | Por colegio |
| N5 | Padre | Acceso solo a avisos y autenticación | Por colegio |
| N6 | Sistema | Procesos automáticos | Por colegio |

---

## Convenciones de la API

- **Prefijo base:** `/api/v1`
- **Autenticación:** token JWT (cada endpoint declara los roles permitidos).
- **Multi-Tenant:** todos los `GET`, `POST`, `PUT`, `DELETE` filtran automáticamente por `colegio_id` del token.
- **Super Admin:** los endpoints en `/api/v1/admin/*` NO filtran por colegio (acceso global).
- **Autorización:** cada endpoint valida el rol del token contra la tabla de actores; retorna 403 si el rol no coincide.
- **Paginación:** todos los `GET` de listados aceptan `?page` y `?limit`.
- **Filtros comunes:** `?date_from`, `?date_to` en endpoints financieros y de eventos/asambleas.
- **Formato de errores:** `{ "error": { "code": "...", "message": "..." } }`.
- **Auditoría:** operaciones de escritura en M7–M10 (multas, ingresos, gastos, movimientos) deberían registrar `board_member_id` o el usuario que ejecuta la acción.
- **Endpoint de sistema (N6):** `POST /fines/generate` debe poder ser invocado por un job/cron interno con credenciales de servicio, no solo por N1.

---

## Índice de Módulos

### Módulos de Backend

| # | Módulo | Archivo | Entidades |
|---|--------|---------|-----------|
| M0 | Admin (Super Admin) | [a5-0-admin.md](./a5-0-admin.md) | Colegio, Usuario, UsuarioColegio |
| M1 | Autenticación y Roles | [a5-1-authentication.md](./a5-1-authentication.md) | Usuario, UsuarioColegio |
| M2 | Padres y Estudiantes | [a5-2-parents-students.md](./a5-2-parents-students.md) | Padre, Estudiante |
| M3 | Directiva | [a5-3-board.md](./a5-3-board.md) | Directiva |
| M4 | Asambleas | [a5-4-assemblies.md](./a5-4-assemblies.md) | Asamblea, DetalleAsamblea |
| M5 | Eventos | [a5-5-events.md](./a5-5-events.md) | Evento |
| M6 | Asistencias | [a5-6-attendance.md](./a5-6-attendance.md) | Asistencia |
| M7 | Multas | [a5-7-fines.md](./a5-7-fines.md) | Multa |
| M8 | Ingresos | [a5-8-income.md](./a5-8-income.md) | Ingreso |
| M9 | Gastos | [a5-9-expenses.md](./a5-9-expenses.md) | Comprobante, ItemGasto, Gasto |
| M10 | Movimientos y Reportes | [a5-10-transactions-reports.md](./a5-10-transactions-reports.md) | Movimiento |
| M11 | Avisos | [a5-11-notices.md](./a5-11-notices.md) | Aviso |

### Módulos de Frontend

| # | Módulo | Archivo |
|---|--------|---------|
| F0 | Panel Super Admin | [a5-0-admin.md](./a5-0-admin.md) |
| F1 | Autenticación | [a5-1-authentication.md](./a5-1-authentication.md) |
| F2 | Padres y Estudiantes | [a5-2-parents-students.md](./a5-2-parents-students.md) |
| F3 | Directiva | [a5-3-board.md](./a5-3-board.md) |
| F4 | Asambleas | [a5-4-assemblies.md](./a5-4-assemblies.md) |
| F5 | Eventos | [a5-5-events.md](./a5-5-events.md) |
| F6 | Asistencias | [a5-6-attendance.md](./a5-6-attendance.md) |
| F7 | Multas | [a5-7-fines.md](./a5-7-fines.md) |
| F8 | Ingresos | [a5-8-income.md](./a5-8-income.md) |
| F9 | Gastos | [a5-9-expenses.md](./a5-9-expenses.md) |
| F10 | Movimientos y Reportes | [a5-10-transactions-reports.md](./a5-10-transactions-reports.md) |
| F11 | Avisos | [a5-11-notices.md](./a5-11-notices.md) |

---

## Pantallas por Actor

| Actor | Módulos Visibles |
|-------|-----------------|
| N0 Super Admin | F0 (Panel Admin: colegios, usuarios), F1 (login/logout) |
| N1 Admin de Colegio | Todos excepto F0 (F1–F11) |
| N2 Presidente / Vicepresidente | Todos excepto F0 y Gestión de roles |
| N3 Tesorero | F1 (login/logout), F7 (multas: ver, registrar/editar manual), F8, F9, F10 |
| N4 Secretario / Vocal | F1 (login/logout), F2 (lectura), F3 (lectura), F4 (lectura + detalle), F5 (lectura), F6, F7 (lectura) |
| N5 Padre | F1 (login/logout), F5 (lectura eventos), F11 (avisos) |
| N6 Sistema | Solo `POST /fines/generate` (sin pantalla) |

---

## Flujo Multi-Tenant (resumen)

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO MULTI-TENANT                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. USUARIO SE AUTENTICA                                         │
│     ┌────────────────────────────────────────────┐               │
│     │ Firebase Auth → email                      │               │
│     │ → Buscar en tabla usuario                  │               │
│     │ → Buscar en usuario_colegio (rol + colegio)│               │
│     │ → JWT: { sub, email, role, colegio_id }    │               │
│     └────────────────────────────────────────────┘               │
│                          ↓                                       │
│  2. PETICIÓN A CUALQUIER ENDPOINT                                │
│     ┌────────────────────────────────────────────┐               │
│     │ GET /api/v1/parents                        │               │
│     │ Header: Authorization: Bearer <jwt>        │               │
│     └────────────────────────────────────────────┘               │
│                          ↓                                       │
│  3. BACKEND FILTRA POR COLEGIO                                   │
│     ┌────────────────────────────────────────────┐               │
│     │ SELECT * FROM padre                        │               │
│     │ WHERE colegio_id = :token_colegio_id       │               │
│     │ AND deleted_at IS NULL                     │               │
│     └────────────────────────────────────────────┘               │
│                          ↓                                       │
│  4. USUARIO SOLO VE SUS DATOS                                   │
│     ┌────────────────────────────────────────────┐               │
│     │ Cada colegio tiene sus propios padres,     │               │
│     │ estudiantes, eventos, etc.                 │               │
│     │ Nunca mezcla datos de otros colegios.      │               │
│     └────────────────────────────────────────────┘               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```
