# A6 — Especificación de Endpoints (Pseudocódigo) (Multi-Tenant)

> **Multi-Tenant:** Todas las queries incluyen `WHERE colegio_id = :token_colegio_id` y los INSERT incluyen `colegio_id`.

Especificación detallada de pseudocódigo con flujo de funciones para cada endpoint, agrupados por módulo.

URL base: `http://localhost:3000/api/v1`

---

## Módulos

| # | Módulo | Archivo | Endpoints |
|---|--------|---------|-----------|
| M1 | Autenticación y Roles | [a6-1-authentication.md](./a6-1-authentication.md) | 5 |
| M2 | Padres y Estudiantes | [a6-2-parents-students.md](./a6-2-parents-students.md) | 11 |
| M3 | Directiva | [a6-3-board.md](./a6-3-board.md) | 5 |
| M4 | Asambleas | [a6-4-assemblies.md](./a6-4-assemblies.md) | 8 |
| M5 | Eventos | [a6-5-events.md](./a6-5-events.md) | 5 |
| M6 | Asistencias | [a6-6-attendance.md](./a6-6-attendance.md) | 3 |
| M7 | Multas | [a6-7-fines.md](./a6-7-fines.md) | 7 |
| M8 | Ingresos | [a6-8-income.md](./a6-8-income.md) | 8 |
| M9 | Gastos | [a6-9-expenses.md](./a6-9-expenses.md) | 11 |
| M10 | Movimientos y Reportes | [a6-10-transactions-reports.md](./a6-10-transactions-reports.md) | 6 |
| M11 | Avisos | [a6-11-notices.md](./a6-11-notices.md) | 2 |

**Total: 71 endpoints**

---

## Documentos Relacionados

| Documento | Contenido |
|-----------|-----------|
| [a7/](./a7/) | DTOs, reglas de dominio y request/response por endpoint |
| [schema-mysql.sql](./schema-mysql.sql) | Esquema de base de datos MySQL |

---

## Convenciones

### Autenticación

- **Firebase Auth** para autenticación con Google Sign-In
- JWT interno para sesiones (expira en 24h)
- JWT incluye: `sub`, `email`, `role`, `colegio_id`, `is_super_admin`
- Todos los endpoints (excepto login) requieren header `Authorization: Bearer <token>`

### Multi-Tenant

- Todas las queries filtran por `colegio_id` del token JWT
- El super_admin (N0) puede ver datos de todos los colegios
- El admin_colegio (N1) solo puede ver datos de su colegio
- El DNI de padres es único POR COLEGIO, no global

### Borrado Lógico

- Campo `deleted_at` en tablas principales
- DELETE retorna 200 OK (borrado lógico, no físico)
- Queries excluyen registros borrados automáticamente

### Reglas de Dominio (RD)

Cada endpoint incluye reglas de dominio marcadas con `RD.funcion()` que validan:
- Existencia de registros padre
- Unicidad de campos
- Permisos de rol
- Validación de datos de entrada
