# A6 M10 — Movimientos y Reportes Financieros

---

## GET `/api/v1/transactions`

**Descripción:** Lista movimientos financieros (ingresos y egresos).

**Actores:** N1, N2, N3

**Pseudocódigo:**

```javascript
function listTransactions(page, limit, type, dateFrom, dateTo) {
  // Recibe: paginación y filtros opcionales (tipo, fecha)

  // Consulta: movimientos en la base de datos
  // Aplica filtros si se proporcionan

  // Devuelve: lista de movimientos paginada
}
```

**Parámetros de consulta:**

| Parámetro | Tipo | Requerido | Descripción |
| ----------- | ------ | ----------- | ------------- |
| page | integer | No | Número de página |
| limit | integer | No | Resultados por página |
| type | string | No | Filtrar por tipo: income o expense |
| date_from | string | No | Filtrar desde fecha |
| date_to | string | No | Filtrar hasta fecha |

**Respuesta (200):**

```json
{
  "data": [
    {
      "id": 1,
      "type": "income",
      "amount": 2000,
      "date": "2026-04-10",
      "description": "Aporte al festival",
      "reference_id": 1,
      "reference_type": "contribution"
    },
    {
      "id": 2,
      "type": "expense",
      "amount": 15000,
      "date": "2026-04-10",
      "description": "Decoraciones del festival",
      "reference_id": 1,
      "reference_type": "expense"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 80,
    "total_pages": 4
  }
}
```

---

## GET `/api/v1/transactions/:id`

**Descripción:** Retorna el detalle de un movimiento.

**Actores:** N1, N2, N3

**Pseudocódigo:**

```javascript
function getTransaction(transactionId) {
  // Recibe: id del movimiento

  // Consulta: datos del movimiento

  // Devuelve: el movimiento completo
}
```

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del movimiento |

**Respuesta (200):**

```json
{
  "data": {
    "id": 1,
    "type": "income",
    "amount": 2000,
    "date": "2026-04-10",
    "description": "Aporte al festival",
    "reference_id": 1,
    "reference_type": "contribution",
    "created_at": "2026-04-10T14:30:00Z"
  }
}
```

---

## GET `/api/v1/transactions/balance`

**Descripción:** Retorna el balance general (total ingresos vs total egresos).

**Actores:** N1, N2, N3

**Pseudocódigo:**

```javascript
function getBalance() {
  // Recibe: nada

  // Consulta: todos los movimientos de tipo income (suma)
  // Consulta: todos los movimientos de tipo expense (suma)
  // Calcula: balance = total_ingresos - total_egresos

  // Devuelve: resumen con totales y balance
}
```

**Respuesta (200):**

```json
{
  "data": {
    "total_income": 200000,
    "total_expense": 120000,
    "balance": 80000,
    "income_count": 45,
    "expense_count": 30,
    "last_updated": "2026-05-01T10:00:00Z"
  }
}
```

---

## GET `/api/v1/reports/financial`

**Descripción:** Genera un reporte financiero con filtros.

**Actores:** N1, N2, N3

**Pseudocódigo:**

```javascript
function generateFinancialReport(dateFrom, dateTo, type) {
  // Recibe: rango de fechas y tipo opcional

  // Valida: que las fechas sean válidas y el rango no sea mayor a 1 año

  // Consulta: movimientos en el rango de fechas
  // Agrupa: por categoría (tipo de ingreso y tipo de gasto)
  // Calcula: totales por categoría

  // Devuelve: reporte con resumen, desglose por categoría y lista de movimientos
}
```

**Parámetros de consulta:**

| Parámetro | Tipo | Requerido | Descripción |
| ----------- | ------ | ----------- | ------------- |
| date_from | string | ✅ | Fecha de inicio (YYYY-MM-DD) |
| date_to | string | ✅ | Fecha de fin (YYYY-MM-DD) |
| type | string | No | Filtrar: income, expense o all (default) |

**Respuesta (200):**

```json
{
  "data": {
    "period": {
      "from": "2026-01-01",
      "to": "2026-05-01"
    },
    "summary": {
      "total_income": 200000,
      "total_expense": 120000,
      "balance": 80000
    },
    "by_category": {
      "income": {
        "donation": 30000,
        "fine": 45000,
        "contribution": 80000,
        "fee": 45000
      },
      "expense": {
        "maintenance": 50000,
        "activity": 40000,
        "supplies": 30000
      }
    },
    "transactions": [
      {
        "id": 1,
        "type": "income",
        "amount": 2000,
        "date": "2026-04-10",
        "description": "Aporte al festival"
      }
    ]
  }
}
```

---

## GET `/api/v1/reports/financial/export?format=pdf`

**Descripción:** Exporta el reporte financiero como PDF.

**Actores:** N1, N2, N3

**Pseudocódigo:**

```javascript
function exportReportPdf(dateFrom, dateTo, type) {
  // Recibe: mismo parámetros que generateFinancialReport

  // Procesa: genera el reporte
  // Convierte: el reporte a formato PDF

  // Devuelve: archivo PDF como respuesta binaria
}
```

**Parámetros de consulta:** Mismos que `/reports/financial`.

**Respuesta:** Archivo PDF binario con `Content-Type: application/pdf`.

---

## GET `/api/v1/reports/financial/export?format=csv`

**Descripción:** Exporta el reporte financiero como CSV.

**Actores:** N1, N2, N3

**Pseudocódigo:**

```javascript
function exportReportCsv(dateFrom, dateTo, type) {
  // Recibe: mismos parámetros que generateFinancialReport

  // Procesa: genera el reporte
  // Convierte: el reporte a formato CSV

  // Devuelve: archivo CSV como respuesta
}
```

**Parámetros de consulta:** Mismos que `/reports/financial`.

**Respuesta:** Archivo CSV con `Content-Type: text/csv`.

**Columnas CSV:**

```
Fecha,Tipo,Categoría,Monto,Descripción,Referencia
2026-04-10,income,contribution,2000,Aporte al festival,Padre #5
2026-04-10,expense,activity,15000,Decoraciones del festival,Comprobante FAC-001
```
