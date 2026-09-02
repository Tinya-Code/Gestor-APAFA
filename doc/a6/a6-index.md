# A6 — Especificación de Endpoints (Request / Response)

Especificación detallada de request y response para cada endpoint, agrupados por módulo.

URL base: `http://localhost:3000/api/v1`

---

## Módulos

| # | Módulo | Archivo | Endpoints |
| --- | -------- | --------- | ----------- |
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

## Formatos de Respuesta Comunes

### Éxito (200)

```json
{
  "data": { ... }
}
```

### Éxito con lista (200)

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

### Error (4xx/5xx)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El DNI es requerido"
  }
}
```

### No encontrado (404)

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Recurso no encontrado"
  }
}
```

### Prohibido (403)

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Permisos insuficientes"
  }
}
```
