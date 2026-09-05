# A7 M10 — DTOs — Movimientos y Reportes Financieros

## Movimientos

**#1 — GET /transactions** — Listar movimientos — Retorna: Datos

**Reglas de dominio**

- Filtros: type (income, expense), date range
- Solo directivos

```ts
// Entrada
interface ListarMovimientosQuery {
  page?: number;
  limit?: number;
  type?: string;
  date_from?: string;
  date_to?: string;
}

// Salida
interface MovimientoEnLista {
  id: number;
  type: string;
  amount: number;
  date: string;
  description: string;
  reference_id: number;
  reference_type: string;
}

interface ListarMovimientosResponse {
  data: MovimientoEnLista[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

---

**#2 — GET /transactions/:id** — Obtener movimiento por id — Retorna: Datos

**Reglas de dominio**

- Retorna movimiento completo

```ts
// Entrada: id del movimiento (path param)

// Salida
interface MovimientoDetalle {
  id: number;
  type: string;
  amount: number;
  date: string;
  description: string;
  reference_id: number;
  reference_type: string;
  created_at: string;
}

interface MovimientoDetalleResponse {
  data: MovimientoDetalle;
}
```

---

**#3 — GET /transactions/balance** — Balance general — Retorna: Datos

**Reglas de dominio**

- Balance general: total ingresos vs total egresos
- Solo directivos

```ts
// Entrada: Ninguna

// Salida
interface BalanceGeneral {
  total_income: number;
  total_expense: number;
  balance: number;
  income_count: number;
  expense_count: number;
  last_updated: string;
}

interface BalanceGeneralResponse {
  data: BalanceGeneral;
}
```

---

## Reportes

**#4 — GET /reports/financial** — Generar reporte financiero — Retorna: Datos

**Reglas de dominio**

- date_from y date_to son obligatorios
- Rango máximo: 365 días
- type opcional: income, expense o all (default)

```ts
// Entrada
interface ReporteFinancieroQuery {
  date_from: string;
  date_to: string;
  type?: string;
}

// Salida
interface ReporteFinanciero {
  period: {
    from: string;
    to: string;
  };
  summary: {
    total_income: number;
    total_expense: number;
    balance: number;
  };
  by_category: {
    income: {
      donation: number;
      fine: number;
      contribution: number;
      fee: number;
    };
    expense: {
      [key: string]: number;
    };
  };
  transactions: {
    id: number;
    type: string;
    amount: number;
    date: string;
    description: string;
  }[];
}

interface ReporteFinancieroResponse {
  data: ReporteFinanciero;
}
```

---

**#5 — GET /reports/financial/export?format=pdf** — Exportar a PDF — Retorna: Archivo

**Reglas de dominio**

- Mismos parámetros que /reports/financial
- Retorna binario PDF

```ts
// Entrada
interface ExportarPdfQuery {
  format: 'pdf';
  date_from: string;
  date_to: string;
  type?: string;
}

// Salida: Binario PDF (Content-Type: application/pdf)
```

---

**#6 — GET /reports/financial/export?format=csv** — Exportar a CSV — Retorna: Archivo

**Reglas de dominio**

- Mismos parámetros que /reports/financial
- Retorna archivo CSV con BOM UTF-8

```ts
// Entrada
interface ExportarCsvQuery {
  format: 'csv';
  date_from: string;
  date_to: string;
  type?: string;
}

// Salida: Archivo CSV (Content-Type: text/csv)
// Columnas: Fecha, Tipo, Categoría, Monto, Descripción, Referencia
```
