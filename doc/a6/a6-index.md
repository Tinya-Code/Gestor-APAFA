# A6 — Especificación de Endpoints (Pseudocódigo)

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

- **Firebase Auth** para autenticación inicial (email + contraseña)
- JWT interno para sesiones (expira en 24h)
- Todos los endpoints (excepto login) requieren header `Authorization: Bearer <token>`

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
