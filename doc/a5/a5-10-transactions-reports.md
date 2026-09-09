# M10 / F10 — Movimientos y Reportes Financieros (Multi-Tenant)

**Entidad:** Movimiento

> **Multi-Tenant:** Todos los endpoints filtran por `colegio_id` del token JWT.

---

## Backend — Endpoints REST

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 1 | GET | `/api/v1/transactions` | Lista movimientos DEL COLEGIO | N0, N1, N2, N3 | Listar movimientos |
| 2 | GET | `/api/v1/transactions/:id` | Detalle de movimiento DEL COLEGIO | N0, N1, N2, N3 | Ver detalle de movimiento |
| 3 | GET | `/api/v1/transactions/balance` | Balance general DEL COLEGIO | N0, N1, N2, N3 | Ver balance general |
| 4 | GET | `/api/v1/reports/financial` | Genera reporte DEL COLEGIO | N0, N1, N2, N3 | Generar reporte financiero |
| 5 | GET | `/api/v1/reports/financial/export?format=pdf` | Exporta reporte DEL COLEGIO a PDF | N0, N1, N2, N3 | Exportar reporte a PDF |
| 6 | GET | `/api/v1/reports/financial/export?format=csv` | Exporta reporte DEL COLEGIO a CSV | N0, N1, N2, N3 | Exportar reporte a CSV |

---

## Frontend — Pantallas y Componentes

### Pantallas

| # | Pantalla | Actores | Consume |
|---|----------|---------|---------|
| 1 | Lista de movimientos | N1, N2, N3 | `GET /transactions` |
| 2 | Detalle de movimiento | N1, N2, N3 | `GET /transactions/:id` |
| 3 | Balance general | N1, N2, N3 | `GET /transactions/balance` |
| 4 | Generar/exportar reporte | N1, N2, N3 | `GET /reports/financial`, `/export` |

### Desglose de Componentes

| Componente | Tipo | Consume | Descripción |
|------------|------|---------|-------------|
| Tabla de Movimientos | Tabla | `GET /transactions` | Lista con tipo, monto, fecha, referencia |
| Tarjeta Detalle Movimiento | Tarjeta | `GET /transactions/:id` | Info completa: tipo, monto, referencia |
| Dashboard Balance | Dashboard | `GET /transactions/balance` | Totales de ingreso vs egreso |
| Generador de Reportes | Formulario | `GET /reports/financial` | Filtros de rango de fechas y tipo para reporte |
| Botones Exportar | Acción | `GET /reports/financial/export` | Botones de exportación PDF y CSV |

---

## Casos de Uso (de A4)

| Caso de Uso | N0 | N1 | N2 | N3 | N4 | N5 | N6 |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Listar movimientos | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Ver detalle de movimiento | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Ver balance general | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Generar reporte financiero | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Exportar reporte a PDF | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Exportar reporte a CSV | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
