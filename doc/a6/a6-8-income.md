# A6 M8 — Ingresos

**#1 — GET /income** — Listar ingresos — Retorna: Datos

```
listarIngresos {
  parsearPaginacion();       // page=1, limit=20 por defecto
  parsearFiltros();          // type (donation, fine, contribution, fee), dateFrom, dateTo, parentId opcionales
  construirConsulta();       // SELECT i.*, CONCAT(p.name, ' ', p.surname) as parent_name, e.title as event_title
                             // FROM ingreso i
                             // JOIN padre p ON p.id = i.parent_id
                             // LEFT JOIN evento e ON e.id = i.event_id
                             // WHERE i.deleted_at IS NULL
                             // Si type: AND i.type = ?
                             // Si dateFrom: AND i.date >= ?
                             // Si dateTo: AND i.date <= ?
                             // Si parentId: AND i.parent_id = ?
                             // ORDER BY i.date DESC
  ejecutarPaginado();        // ejecuta con LIMIT/OFFSET, cuenta total
  retornarDatos();           // retorna { data: [...], pagination: { page, limit, total, total_pages } }
}
```

**#2 — GET /income/:id** — Obtener ingreso por id — Retorna: Datos

```
detalleIngreso {
  RD.ingresoExiste();        // el ingreso existe en la base de datos
  buscarIngreso();           // SELECT * FROM ingreso WHERE id = ? AND deleted_at IS NULL
  buscarPadre();             // datos del padre que realiza el aporte
  buscarEvento();            // datos del evento asociado (puede ser null)
  buscarDirectivo();         // datos del directivo que registra
  retornarDatos();           // retorna { id, parent: {...}, event: {...}, board_member_name, amount, date, description, type }
}
```

**#3 — POST /income** — Registrar ingreso — Retorna: Datos

```
nuevoIngreso {
  RD.nuevoIngreso();         // parent_id, amount, date, type son obligatorios
  RD.tipoValido();           // type debe ser: donation, fine, contribution, fee
  RD.montoPositivo();        // amount > 0
  RD.padreExiste();          // el padre debe existir
  insertarIngreso();         // INSERT INTO ingreso (parent_id, event_id, board_member_id, amount, date, description, type, created_at, updated_at)
                             // VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  crearMovimiento();         // INSERT INTO movimiento (type, amount, date, description, reference_id, reference_type, created_at, updated_at)
                             // VALUES ('ingreso', ?, ?, ?, ?, 'ingreso', NOW(), NOW())
  retornarDatos();           // retorna ingreso con id y created_at
}
```

**#4 — PUT /income/:id** — Editar ingreso — Retorna: Datos

```
actualizarIngreso {
  RD.ingresoExiste();        // el ingreso existe en la base de datos
  validarCambios();          // solo actualiza campos presentes (patch parcial)
  actualizarCampos();        // UPDATE ingreso SET amount=COALESCE(?,amount), date=COALESCE(?,date),
                             //   description=COALESCE(?,description), type=COALESCE(?,type), updated_at=NOW()
                             //   WHERE id = ?
  retornarDatos();           // retorna ingreso actualizado
}
```

**#5 — DELETE /income/:id** — Eliminar ingreso — Retorna: Mensaje

```
eliminarIngreso {
  RD.adminOnly();            // solo administradores (N1)
  RD.ingresoExiste();        // el ingreso existe en la base de datos
  borrarLogicoCascada();     // UPDATE ingreso SET deleted_at = NOW() WHERE id = ?
                             // UPDATE movimiento SET deleted_at = NOW() WHERE reference_id = ? AND reference_type = 'ingreso'
  retornarMensaje();         // retorna "Ingreso eliminado exitosamente"
}
```

**#6 — GET /parents/:id/income** — Historial de ingresos de un padre — Retorna: Datos

```
historialIngresos {
  RD.padreExiste();          // el padre debe existir
  parsearPaginacion();       // page=1, limit=20 por defecto
  construirConsulta();       // SELECT i.*, e.title as event_title FROM ingreso i
                             // LEFT JOIN evento e ON e.id = i.event_id
                             // WHERE i.parent_id = ? AND i.deleted_at IS NULL
                             // ORDER BY i.date DESC
  ejecutarPaginado();        // ejecuta con LIMIT/OFFSET, cuenta total
  retornarDatos();           // retorna { data: [...], pagination: { page, limit, total, total_pages } }
}
```

**#7 — GET /income/totals-panel** — Panel de totales — Retorna: Datos

```
panelTotales {
  calcularRecaudado();       // SELECT SUM(amount) FROM ingreso WHERE deleted_at IS NULL
  calcularPendiente();       // SELECT SUM(m.amount) FROM multa m WHERE m.paid = 0 AND m.deleted_at IS NULL
  calcularPorTipo();         // SELECT type, SUM(amount) FROM ingreso WHERE deleted_at IS NULL GROUP BY type
  calcularPorMes();          // SELECT DATE_FORMAT(date, '%Y-%m') as month, SUM(amount) as collected
                             // FROM ingreso WHERE deleted_at IS NULL GROUP BY month ORDER BY month DESC
  retornarDatos();           // retorna { total_collected, total_pending, by_type: {...}, by_month: [...] }
}
```

**#8 — GET /parents/:id/financial-status** — Estado financiero por padre — Retorna: Datos

```
estadoFinanciero {
  RD.padreExiste();          // el padre debe existir
  calcularIngresos();        // SELECT COUNT(*), COALESCE(SUM(amount), 0) FROM ingreso
                             // WHERE parent_id = ? AND deleted_at IS NULL
  calcularMultas();          // SELECT COUNT(*), COALESCE(SUM(amount), 0) as total,
                             //   SUM(CASE WHEN paid = 1 THEN amount ELSE 0 END) as paid,
                             //   SUM(CASE WHEN paid = 0 THEN amount ELSE 0 END) as pending,
                             //   SUM(CASE WHEN paid = 0 THEN 1 ELSE 0 END) as pending_count
                             // FROM multa WHERE parent_id = ? AND deleted_at IS NULL
  calcularBalance();         // balance = incomeTotal - finesPending
  retornarDatos();           // retorna { parent_id, parent_name, income: {total, count},
                             //   fines: {total, pending, paid, count}, balance }
}
```
