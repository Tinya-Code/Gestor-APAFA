# M9 / F9 — Gastos

**Entidades:** Receipt, ExpenseItem, Expense

---

## Backend — Endpoints REST

| # | Método | Endpoint | Descripción | Actores | Caso de Uso |
|---|--------|----------|-------------|---------|-------------|
| 1 | GET | `/api/v1/expenses` | Lista gastos (filtros por tipo/fecha) | N1, N2, N3 | Listar gastos |
| 2 | GET | `/api/v1/expenses/:id` | Detalle de gasto (incluye comprobante e items) | N1, N2, N3 | Ver detalle de gasto |
| 3 | POST | `/api/v1/expenses` | Registra gasto | N1, N2, N3 | Registrar gasto |
| 4 | PUT | `/api/v1/expenses/:id` | Edita gasto (reclasificar tipo/fecha) | N1, N2, N3 | Editar gasto |
| 5 | DELETE | `/api/v1/expenses/:id` | Elimina gasto | N1 | Eliminar gasto |
| 6 | POST | `/api/v1/receipts` | Registra comprobante | N1, N2, N3 | Registrar comprobante |
| 7 | PUT | `/api/v1/receipts/:id` | Edita comprobante | N1, N2, N3 | Editar comprobante |
| 8 | DELETE | `/api/v1/receipts/:id` | Elimina comprobante | N1 | Eliminar comprobante |
| 9 | POST | `/api/v1/receipts/:id/items` | Registra item de gasto sobre un comprobante | N1, N2, N3 | Registrar item de gasto |
| 10 | PUT | `/api/v1/receipts/:id/items/:itemId` | Edita item de gasto | N1, N2, N3 | Editar item de gasto |
| 11 | DELETE | `/api/v1/receipts/:id/items/:itemId` | Elimina item de gasto | N1 | Eliminar item de gasto |

---

## Frontend — Pantallas y Componentes

### Pantallas

| # | Pantalla | Actores | Consume |
|---|----------|---------|---------|
| 1 | Lista de gastos | N1, N2, N3 | `GET /expenses` |
| 2 | Detalle de gasto | N1, N2, N3 | `GET /expenses/:id` |
| 3 | Formulario comprobante (crear/editar) | N1, N2, N3 | `POST/PUT /receipts` |
| 4 | Formulario item de gasto (crear/editar) | N1, N2, N3 | `POST/PUT /receipts/:id/items` |
| 5 | Formulario gasto (crear/editar) | N1, N2, N3 | `POST/PUT /expenses` |

### Desglose de Componentes

| Componente | Tipo | Consume | Descripción |
|------------|------|---------|-------------|
| Tabla de Gastos | Tabla | `GET /expenses` | Lista con tipo, fecha, total, comprobante |
| Tarjeta Detalle Gasto | Tarjeta | `GET /expenses/:id` | Info completa con comprobante e items anidados |
| Formulario Comprobante | Formulario | `POST/PUT /receipts` | Crear/editar: número, tipo, fecha, descripción |
| Formulario Item Gasto | Formulario | `POST/PUT /receipts/:id/items` | Crear/editar item: descripción, monto |
| Formulario Gasto | Formulario | `POST/PUT /expenses` | Crear/editar: evento, comprobante, tipo, total, fecha, descripción |
| Tabla Items Comprobante | Tabla | `GET /expenses/:id` | Lista anidada de items bajo un comprobante |

---

## Casos de Uso (de A4)

| Caso de Uso | N1 | N2 | N3 | N4 | N5 | N6 |
|-------------|:--:|:--:|:--:|:--:|:--:|:--:|
| Listar gastos | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Ver detalle de gasto | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Registrar comprobante | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Registrar item de gasto | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Registrar gasto | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Editar comprobante | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Editar item de gasto | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Editar gasto | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Eliminar comprobante | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Eliminar item de gasto | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Eliminar gasto | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Clasificar gasto por tipo y fecha | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
