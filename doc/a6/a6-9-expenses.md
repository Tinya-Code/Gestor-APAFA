# A6 M9 — Gastos

## Gastos

**#1 — GET /expenses** — Listar gastos — Retorna: Datos

```
listarGastos {
  parsearPaginacion();       // page=1, limit=20 por defecto
  parsearFiltros();          // type, dateFrom, dateTo opcionales
  construirConsulta();       // SELECT g.*, e.title as event_title, c.receipt_number
                             // FROM gasto g
                             // LEFT JOIN evento e ON e.id = g.event_id
                             // LEFT JOIN comprobante c ON c.id = g.receipt_id
                             // WHERE g.deleted_at IS NULL
                             // Si type: AND g.type = ?
                             // Si dateFrom: AND g.date >= ?
                             // Si dateTo: AND g.date <= ?
                             // ORDER BY g.date DESC
  ejecutarPaginado();        // ejecuta con LIMIT/OFFSET, cuenta total
  retornarDatos();           // retorna { data: [...], pagination: { page, limit, total, total_pages } }
}
```

**#2 — GET /expenses/:id** — Obtener gasto por id — Retorna: Datos

```
detalleGasto {
  RD.gastoExiste();          // el gasto existe en la base de datos
  buscarGasto();             // SELECT * FROM gasto WHERE id = ? AND deleted_at IS NULL
  buscarComprobante();       // SELECT * FROM comprobante WHERE id = ?
  buscarItems();             // SELECT * FROM item_gasto WHERE receipt_id = ?
  retornarDatos();           // retorna { id, event_title, receipt: {...}, items: [...], total, type, date, description }
}
```

**#3 — POST /expenses** — Registrar gasto — Retorna: Datos

```
nuevoGasto {
  RD.nuevoGasto();           // receipt_id, total, type, date son obligatorios; total > 0
  RD.comprobanteExiste();    // el comprobante debe existir
  insertarGasto();           // INSERT INTO gasto (event_id, receipt_id, board_member_id, total, type, date, description, created_at, updated_at)
                             // VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  crearMovimiento();         // INSERT INTO movimiento (type, amount, date, description, reference_id, reference_type, created_at, updated_at)
                             // VALUES ('egreso', ?, ?, ?, ?, 'gasto', NOW(), NOW())
  retornarDatos();           // retorna gasto con id y created_at
}
```

**#4 — PUT /expenses/:id** — Editar gasto — Retorna: Datos

```
actualizarGasto {
  RD.gastoExiste();          // el gasto existe en la base de datos
  validarCambios();          // solo actualiza campos presentes (patch parcial)
  actualizarCampos();        // UPDATE gasto SET total=COALESCE(?,total), type=COALESCE(?,type),
                             //   date=COALESCE(?,date), description=COALESCE(?,description), updated_at=NOW()
                             //   WHERE id = ?
  retornarDatos();           // retorna gasto actualizado
}
```

**#5 — DELETE /expenses/:id** — Eliminar gasto — Retorna: Mensaje

```
eliminarGasto {
  RD.adminOnly();            // solo administradores (N1)
  RD.gastoExiste();          // el gasto existe en la base de datos
  borrarLogicoCascada();     // UPDATE gasto SET deleted_at = NOW() WHERE id = ?
                             // UPDATE movimiento SET deleted_at = NOW() WHERE reference_id = ? AND reference_type = 'gasto'
  retornarMensaje();         // retorna "Gasto eliminado exitosamente"
}
```

## Comprobantes

**#6 — POST /receipts** — Registrar comprobante — Retorna: Datos

```
nuevoComprobante {
  RD.nuevoComprobante();     // board_member_id, receipt_number, type, date son obligatorios
  RD.directivoExiste();      // el directivo debe existir
  RD.numeroUnico();          // receipt_number debe ser único entre comprobantes activos
  insertarComprobante();     // INSERT INTO comprobante (board_member_id, receipt_number, type, date, description, created_at, updated_at)
                             // VALUES (?, ?, ?, ?, ?, NOW(), NOW())
  retornarDatos();           // retorna comprobante con id
}
```

**#7 — PUT /receipts/:id** — Editar comprobante — Retorna: Datos

```
actualizarComprobante {
  RD.comprobanteExiste();    // el comprobante existe en la base de datos
  validarCambios();          // solo actualiza campos presentes (patch parcial)
  actualizarCampos();        // UPDATE comprobante SET receipt_number=COALESCE(?,receipt_number),
                             //   type=COALESCE(?,type), date=COALESCE(?,date),
                             //   description=COALESCE(?,description), updated_at=NOW() WHERE id = ?
  retornarDatos();           // retorna comprobante actualizado
}
```

**#8 — DELETE /receipts/:id** — Eliminar comprobante — Retorna: Mensaje

```
eliminarComprobante {
  RD.adminOnly();            // solo administradores (N1)
  RD.comprobanteExiste();    // el comprobante existe en la base de datos
  borrarLogicoCascada();     // UPDATE comprobante SET deleted_at = NOW() WHERE id = ?
                             // UPDATE item_gasto SET deleted_at = NOW() WHERE receipt_id = ?
  retornarMensaje();         // retorna "Comprobante eliminado exitosamente"
}
```

## Items de Gasto

**#9 — POST /receipts/:id/items** — Registrar item de gasto — Retorna: Datos

```
nuevoItem {
  RD.comprobanteExiste();    // el comprobante debe existir
  RD.nuevoItem();            // description y amount son obligatorios; amount > 0
  insertarItem();            // INSERT INTO item_gasto (receipt_id, description, amount, created_at, updated_at)
                             // VALUES (?, ?, ?, NOW(), NOW())
  retornarDatos();           // retorna item con id
}
```

**#10 — PUT /receipts/:id/items/:itemId** — Editar item de gasto — Retorna: Datos

```
actualizarItem {
  RD.itemExiste();           // el item debe existir y pertenecer al comprobante
  actualizarCampos();        // UPDATE item_gasto SET description=COALESCE(?,description),
                             //   amount=COALESCE(?,amount), updated_at=NOW() WHERE id = ?
  retornarDatos();           // retorna item actualizado
}
```

**#11 — DELETE /receipts/:id/items/:itemId** — Eliminar item de gasto — Retorna: Mensaje

```
eliminarItem {
  RD.adminOnly();            // solo administradores (N1)
  RD.itemExiste();           // el item debe existir y pertenecer al comprobante
  borrarLogico();            // UPDATE item_gasto SET deleted_at = NOW() WHERE id = ?
  retornarMensaje();         // retorna "Item de gasto eliminado exitosamente"
}
```
