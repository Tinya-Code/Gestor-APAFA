# A6 M10 — Movimientos y Reportes Financieros (Multi-Tenant)

> **Multi-Tenant:** Todas las queries incluyen `WHERE colegio_id = :token_colegio_id` y los INSERT incluyen `colegio_id`.

## Movimientos

**#1 — GET /transactions** — Listar movimientos — Retorna: Datos

```
listarMovimientos {
  parsearPaginacion();       // page=1, limit=20 por defecto
  parsearFiltros();          // type (ingreso, egreso), dateFrom, dateTo opcionales
  construirConsulta();       // SELECT * FROM movimiento WHERE colegio_id = :token_colegio_id
                             // Si type: AND type = ?
                             // Si dateFrom: AND date >= ?
                             // Si dateTo: AND date <= ?
                             // ORDER BY date DESC
  ejecutarPaginado();        // ejecuta con LIMIT/OFFSET, cuenta total
  retornarDatos();           // retorna { data: [...], pagination: { page, limit, total, total_pages } }
}
```

**#2 — GET /transactions/:id** — Obtener movimiento por id — Retorna: Datos

```
detalleMovimiento {
  RD.movimientoExiste();     // el movimiento existe en la base de datos Y PERTENECE AL COLEGIO
  buscarMovimiento();        // SELECT * FROM movimiento WHERE id = ? AND colegio_id = :token_colegio_id
  retornarDatos();           // retorna { id, type, amount, date, description, reference_id, reference_type, created_at }
}
```

**#3 — GET /transactions/balance** — Balance general — Retorna: Datos

```
balanceGeneral {
  calcularTotalIngresos();   // SELECT COALESCE(SUM(amount), 0) FROM movimiento WHERE type = 'ingreso' AND colegio_id = :token_colegio_id
  calcularTotalEgresos();    // SELECT COALESCE(SUM(amount), 0) FROM movimiento WHERE type = 'egreso' AND colegio_id = :token_colegio_id
  contarPorTipo();           // SELECT type, COUNT(*) FROM movimiento WHERE colegio_id = :token_colegio_id GROUP BY type
  calcularBalance();         // balance = totalIncome - totalExpense
  retornarDatos();           // retorna { total_income, total_expense, balance, income_count, expense_count, last_updated }
}
```

## Reportes

**#4 — GET /reports/financial** — Generar reporte financiero — Retorna: Datos

```
generarReporte {
  RD.fechasValidas();        // formato YYYY-MM-DD, dateFrom <= dateTo, rango max 365 días
  consultarMovimientos();    // SELECT * FROM movimiento
                             // WHERE date BETWEEN ? AND ? AND colegio_id = :token_colegio_id
                             // Si type: AND type = ?
                             // ORDER BY date
  agruparPorCategoria();     // agrupa ingresos por type: donation, fine, contribution, fee
                             // agrupa egresos por type del gasto asociado
  calcularResumen();         // total_income, total_expense, balance
  retornarDatos();           // retorna { period, summary, by_category, transactions }
}
```

**#5 — GET /reports/financial/export?format=pdf** — Exportar a PDF — Retorna: Archivo

```
exportarPdf {
  RD.fechasValidas();        // mismo formato que reporte JSON
  generarReporte();          // reutiliza la lógica del reporte JSON
  convertirAPdf();           // genera PDF con librería (PDFKit, jsPDF, etc.)
                             // incluye: encabezado, tabla de resumen, desglose por categoría, lista de movimientos
  retornarPdf();             // Content-Type: application/pdf, Content-Disposition: attachment
}
```

**#6 — GET /reports/financial/export?format=csv** — Exportar a CSV — Retorna: Archivo

```
exportarCsv {
  RD.fechasValidas();        // mismo formato que reporte JSON
  generarReporte();          // reutiliza la lógica del reporte JSON
  convertirACsv();           // columnas: Fecha, Tipo, Categoría, Monto, Descripción, Referencia
                             // formato: UTF-8 con BOM para Excel
  retornarCsv();             // Content-Type: text/csv, Content-Disposition: attachment
                             // nombre: reporte-financiero-{dateFrom}-{dateTo}.csv
}
```
