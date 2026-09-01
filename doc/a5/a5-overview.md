# A5 — Resumen General: Backend, Endpoints y Frontend

Separación por módulos basada en la matriz de accesos de casos de uso (A4) y el modelo de entidades (A2).

---

## Actores

| Código | Actor | Descripción |
|--------|-------|-------------|
| N1 | Administrador | Acceso de super usuario |
| N2 | Presidente / Vicepresidente | Acceso completo excepto panel de tesorero |
| N3 | Tesorero | Acceso a operaciones financieras |
| N4 | Secretario / Vocal | Asistencias, asambleas y solo lectura |
| N5 | Padre | Acceso solo a avisos y autenticación |
| N6 | Sistema | Procesos automáticos |

---

## Convenciones de la API

- **Prefijo base:** `/api/v1`
- **Autenticación:** token JWT (cada endpoint declara los roles permitidos). `[N1-N4]` significa N1, N2, N3 y N4.
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
| M1 | Autenticación y Roles | [a5-1-authentication.md](./a5-1-authentication.md) | User, Role |
| M2 | Padres y Estudiantes | [a5-2-parents-students.md](./a5-2-parents-students.md) | Parent, Student |
| M3 | Directiva | [a5-3-board.md](./a5-3-board.md) | BoardMember |
| M4 | Asambleas | [a5-4-assemblies.md](./a5-4-assemblies.md) | Assembly, AssemblyDetail |
| M5 | Eventos | [a5-5-events.md](./a5-5-events.md) | Event |
| M6 | Asistencias | [a5-6-attendance.md](./a5-6-attendance.md) | Attendance |
| M7 | Multas | [a5-7-fines.md](./a5-7-fines.md) | Fine |
| M8 | Ingresos | [a5-8-income.md](./a5-8-income.md) | Income |
| M9 | Gastos | [a5-9-expenses.md](./a5-9-expenses.md) | Receipt, ExpenseItem, Expense |
| M10 | Movimientos y Reportes | [a5-10-transactions-reports.md](./a5-10-transactions-reports.md) | Transaction |
| M11 | Avisos | [a5-11-notices.md](./a5-11-notices.md) | Notice |

### Módulos de Frontend

| # | Módulo | Archivo |
|---|--------|---------|
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
| N1 Administrador | Todos (F1–F11) |
| N2 Presidente / Vicepresidente | Todos excepto Gestión de roles |
| N3 Tesorero | F1 (login/logout), F7 (multas: ver, registrar/editar manual), F8, F9, F10 |
| N4 Secretario / Vocal | F1 (login/logout), F2 (lectura), F3 (lectura), F4 (lectura + detalle), F5 (lectura), F6, F7 (lectura) |
| N5 Padre | F1 (login/logout), F5 (lectura eventos), F11 (avisos) |
| N6 Sistema | Solo `POST /fines/generate` (sin pantalla) |
