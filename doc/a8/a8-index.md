# A8 — Request y Response HTTP

Especificación completa de solicitudes y respuestas HTTP para cada endpoint, incluyendo headers, body JSON de ejemplo y códigos de estado.

URL base: `http://localhost:3000/api/v1`

---

## Módulos

| # | Módulo | Archivo | Endpoints |
|---|--------|---------|-----------|
| M1 | Autenticación y Roles | [a8-1-authentication.md](./a8-1-authentication.md) | 5 |
| M2 | Padres y Estudiantes | [a8-2-parents-students.md](./a8-2-parents-students.md) | 11 |
| M3 | Directiva | [a8-3-board.md](./a8-3-board.md) | 5 |
| M4 | Asambleas | [a8-4-assemblies.md](./a8-4-assemblies.md) | 8 |
| M5 | Eventos | [a8-5-events.md](./a8-5-events.md) | 5 |
| M6 | Asistencias | [a8-6-attendance.md](./a8-6-attendance.md) | 3 |
| M7 | Multas | [a8-7-fines.md](./a8-7-fines.md) | 7 |
| M8 | Ingresos | [a8-8-income.md](./a8-8-income.md) | 8 |
| M9 | Gastos | [a8-9-expenses.md](./a8-9-expenses.md) | 11 |
| M10 | Movimientos y Reportes | [a8-10-transactions-reports.md](./a8-10-transactions-reports.md) | 6 |
| M11 | Avisos | [a8-11-notices.md](./a8-11-notices.md) | 2 |

**Total: 71 endpoints**

---

## Documentos Relacionados

| Documento | Contenido |
|-----------|-----------|
| [a6/](./a6/) | Pseudocódigo de lógica de negocio |
| [a7/](./a7/) | DTOs y interfaces TypeScript |

---

## Convenciones HTTP

### Headers Comunes

```
Content-Type: application/json
Authorization: Bearer <token>
```

### Formato de Éxito

```json
{
  "data": { ... }
}
```

### Formato con Paginación

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

### Formato de Error

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error",
    "details": [
      { "field": "campo", "message": "Detalle del campo" }
    ]
  }
}
```

### Códigos de Respuesta

| Código | Significado |
|--------|-------------|
| 200 | OK — Operación exitosa |
| 201 | Created — Recurso creado |
| 400 | Bad Request — Solicitud inválida |
| 401 | Unauthorized — Token inválido o ausente |
| 403 | Forbidden — Permisos insuficientes |
| 404 | Not Found — Recurso no encontrado |
| 409 | Conflict — Conflicto de estado |
| 422 | Unprocessable Entity — Error de validación |
| 502 | Bad Gateway — Error de servicio externo |
