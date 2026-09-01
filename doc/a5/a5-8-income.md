# M8 / F8 — Ingresos

**Entidad:** Income

---

## Backend — Endpoints REST

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 1 | GET | `/api/v1/income` | Lista ingresos (filtros por tipo/fecha/padre) | N1, N2, N3 | Listar ingresos |
| 2 | GET | `/api/v1/income/:id` | Detalle de ingreso | N1, N2, N3 | Ver detalle de ingreso |
| 3 | POST | `/api/v1/income` | Registra ingreso (donación, multa, aporte, cuota) | N1, N2, N3 | Registrar ingreso |
| 4 | PUT | `/api/v1/income/:id` | Edita ingreso | N1, N2, N3 | Editar ingreso |
| 5 | DELETE | `/api/v1/income/:id` | Elimina ingreso | N1 | Eliminar ingreso |
| 6 | GET | `/api/v1/parents/:id/income` | Historial de ingresos de un padre | N1, N2, N3 | Ver historial de ingresos por padre |
| 7 | GET | `/api/v1/income/totals-panel` | Panel de totales recaudados y pendientes | N1, N2, N3 | Ver panel de totales |
| 8 | GET | `/api/v1/parents/:id/financial-status` | Estado combinado de ingresos y multas por padre | N1, N2, N3 | Ver estado financiero por padre |

---

## Frontend — Pantallas y Componentes

### Pantallas

| # | Pantalla | Actores | Consume |
|---|----------|---------|---------|
| 1 | Lista de ingresos | N1, N2, N3 | `GET /income` |
| 2 | Detalle de ingreso | N1, N2, N3 | `GET /income/:id` |
| 3 | Formulario ingreso (crear/editar) | N1, N2, N3 | `POST/PUT /income` |
| 4 | Historial de ingresos por padre | N1, N2, N3 | `GET /parents/:id/income` |
| 5 | Panel de totales | N1, N2, N3 | `GET /income/totals-panel` |
| 6 | Estado financiero por padre | N1, N2, N3 | `GET /parents/:id/financial-status` |

### Desglose de Componentes

| Componente | Tipo | Consume | Descripción |
|------------|------|---------|-------------|
| Tabla de Ingresos | Tabla | `GET /income` | Lista con padre, tipo, monto, fecha |
| Tarjeta Detalle Ingreso | Tarjeta | `GET /income/:id` | Info completa: padre, evento, tipo, monto |
| Formulario Ingreso | Formulario | `POST/PUT /income` | Crear/editar: padre, evento, tipo, monto, descripción |
| Historial Padre | Tabla | `GET /parents/:id/income` | Registros históricos de ingresos de un padre |
| Panel Totales | Dashboard | `GET /income/totals-panel` | Resumen de recaudado vs pendiente |
| Tarjeta Estado Financiero | Tarjeta | `GET /parents/:id/financial-status` | Vista combinada: ingresos y multas de un padre |

---

## Casos de Uso (de A4)

| Caso de Uso | N1 | N2 | N3 | N4 | N5 | N6 |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|
| Listar ingresos | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Ver detalle de ingreso | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Registrar ingreso | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Editar ingreso | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Eliminar ingreso | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver historial de ingresos por padre | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Ver panel de totales | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Ver estado financiero por padre | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
