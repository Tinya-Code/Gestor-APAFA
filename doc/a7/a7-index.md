# A7 — DTOs, Reglas de Dominio y Request/Response

Definición de Data Transfer Objects, reglas de negocio y formatos de solicitud/respuesta para cada endpoint, agrupados por módulo.

URL base: `http://localhost:3000/api/v1`

---

## Módulos

| # | Módulo | Archivo | Endpoints |
|---|--------|---------|-----------|
| M1 | Autenticación y Roles | [a7-1-authentication.md](./a7-1-authentication.md) | 5 |
| M2 | Padres y Estudiantes | [a7-2-parents-students.md](./a7-2-parents-students.md) | 11 |
| M3 | Directiva | [a7-3-board.md](./a7-3-board.md) | 5 |
| M4 | Asambleas | [a7-4-assemblies.md](./a7-4-assemblies.md) | 8 |
| M5 | Eventos | [a7-5-events.md](./a7-5-events.md) | 5 |
| M6 | Asistencias | [a7-6-attendance.md](./a7-6-attendance.md) | 3 |
| M7 | Multas | [a7-7-fines.md](./a7-7-fines.md) | 7 |
| M8 | Ingresos | [a7-8-income.md](./a7-8-income.md) | 8 |
| M9 | Gastos | [a7-9-expenses.md](./a7-9-expenses.md) | 11 |
| M10 | Movimientos y Reportes | [a7-10-transactions-reports.md](./a7-10-transactions-reports.md) | 6 |
| M11 | Avisos | [a7-11-notices.md](./a7-11-notices.md) | 2 |

**Total: 71 endpoints**

---

## Formatos de Respuesta Comunes

### Éxito (200)

```json
{
  "data": { ... }
}
```

### Creado (201)

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
    "code": "ERROR_CODE",
    "message": "Descripción del error",
    "details": [
      { "field": "campo", "message": "Detalle del campo" }
    ]
  }
}
```

### Códigos de respuesta

| Código | Significado |
|--------|-------------|
| 200 | OK — Operación exitosa |
| 201 | Created — Recurso creado |
| 400 | Bad Request — Solicitud inválida |
| 401 | Unauthorized — Token inválido o ausente |
| 403 | Forbidden — Permisos insuficientes |
| 404 | Not Found — Recurso no encontrado |
| 409 | Conflict — Conflicto de estado (DNI duplicado, rol ocupado) |
| 422 | Unprocessable Entity — Error de validación |
| 502 | Bad Gateway — Error de servicio externo (Firebase) |

---

## Convenciones

### Autenticación

Todos los endpoints (excepto `POST /auth/login`) requieren header:

```
Authorization: Bearer <token>
```

El token es un JWT firmado por el backend con payload: `{ sub, role, email }`.

### Borrado Lógico

Los endpoints DELETE realizan borrado lógico (`deleted_at = NOW()`), no eliminación física. Las consultas excluyen registros borrados automáticamente (`WHERE deleted_at IS NULL`).

### Interfaces TypeScript

Cada endpoint define:
- **Entrada**: Interface o tipo del DTO de entrada (request body, query params, path params)
- **Salida**: Interface de la respuesta esperada
- **Reglas de dominio**: Validaciones y restricciones de negocio
