# A6 M7 — Multas (Multi-Tenant)

> **Multi-Tenant:** Todas las queries incluyen `WHERE colegio_id = :token_colegio_id` y los INSERT incluyen `colegio_id`.

**#1 — GET /fines** — Listar multas — Retorna: Datos

```
listarMultas {
  parsearPaginacion();       // page=1, limit=20 por defecto
  parsearFiltros();          // parentId, eventId, paid opcionales
  construirConsulta();       // SELECT m.*, CONCAT(p.name, ' ', p.surname) as parent_name, e.title as event_title
                             // FROM multa m
                             // JOIN padre p ON p.id = m.parent_id
                             // JOIN evento e ON e.id = m.event_id
                             // WHERE m.deleted_at IS NULL AND m.colegio_id = :token_colegio_id
                             // Si parentId: AND m.parent_id = ?
                             // Si eventId: AND m.event_id = ?
                             // Si paid !== null: AND m.paid = ?
                             // ORDER BY m.generated_date DESC
  ejecutarPaginado();        // ejecuta con LIMIT/OFFSET, cuenta total
  retornarDatos();           // retorna { data: [...], pagination: { page, limit, total, total_pages } }
}
```

**#2 — GET /fines/:id** — Obtener multa por id — Retorna: Datos

```
detalleMulta {
  RD.multaExiste();          // la multa existe en la base de datos Y PERTENECE AL COLEGIO
  buscarMulta();             // SELECT * FROM multa WHERE id = ? AND deleted_at IS NULL AND colegio_id = :token_colegio_id
  buscarPadre();             // datos del padre sancionado
  buscarEvento();            // datos del evento que generó la multa
  retornarDatos();           // retorna { id, parent: {...}, event: {...}, amount, paid, generated_date, payment_date }
}
```

**#3 — POST /fines** — Registrar multa manual — Retorna: Datos

```
nuevaMulta {
  RD.nuevaMulta();           // parent_id, event_id, amount son obligatorios; amount > 0
  RD.padreExiste();          // el padre debe existir Y PERTENECE AL COLEGIO
  RD.eventoExiste();         // el evento debe existir Y PERTENECE AL COLEGIO
  insertarMulta();           // INSERT INTO multa (parent_id, event_id, amount, paid, generated_date, colegio_id, created_at, updated_at)
                             // VALUES (?, ?, ?, 0, CURDATE(), :token_colegio_id, NOW(), NOW())
                             // paid = false por defecto, generated_date = fecha actual
  retornarDatos();           // retorna multa con id, generated_date y paid: false
}
```

**#4 — POST /fines/generate** — Generar multas automáticas por inasistencia — Retorna: Datos

```
generarMultas {
  RD.eventoExiste();         // el evento debe existir Y PERTENECE AL COLEGIO
  RD.generaMultas();         // generates_fine = true
  buscarAusentes();          // SELECT a.parent_id FROM asistencia a
                             // WHERE a.event_id = ? AND a.attended = 0 AND a.deleted_at IS NULL
                             //   AND a.colegio_id = :token_colegio_id
  crearMultasAusentes();     // para cada padre ausente:
                             //   verifica que no tenga ya una multa para este evento EN EL COLEGIO
                             //   INSERT INTO multa (parent_id, event_id, amount, paid, generated_date, colegio_id)
                             //   VALUES (?, ?, event.fine_amount, 0, CURDATE(), :token_colegio_id)
  retornarDatos();           // retorna { generated: count, event_id, message: "X multas generadas" }
}
```

**#5 — PUT /fines/:id** — Editar multa — Retorna: Datos

```
actualizarMulta {
  RD.multaExiste();          // la multa existe en la base de datos Y PERTENECE AL COLEGIO
  validarCambios();          // si paid=true, payment_date debe estar presente; amount > 0 si se envía
  actualizarCampos();        // UPDATE multa SET amount=COALESCE(?,amount), paid=COALESCE(?,paid),
                             //   payment_date=COALESCE(?,payment_date), updated_at=NOW()
                             //   WHERE id = ? AND colegio_id = :token_colegio_id
  retornarDatos();           // retorna multa actualizada
}
```

**#6 — DELETE /fines/:id** — Eliminar multa — Retorna: Mensaje

```
eliminarMulta {
  RD.adminOnly();            // solo administradores (N0, N1)
  RD.multaExiste();          // la multa existe en la base de datos Y PERTENECE AL COLEGIO
  borrarLogico();            // UPDATE multa SET deleted_at = NOW() WHERE id = ? AND colegio_id = :token_colegio_id
  retornarMensaje();         // retorna "Multa eliminada exitosamente"
}
```

**#7 — GET /parents/:id/fines** — Estado de multas de un padre — Retorna: Datos

```
multasPadre {
  RD.padreExiste();          // el padre debe existir Y PERTENECE AL COLEGIO
  buscarMultas();            // SELECT m.*, e.title as event_title FROM multa m
                             // JOIN evento e ON e.id = m.event_id
                             // WHERE m.parent_id = ? AND m.deleted_at IS NULL
                             //   AND m.colegio_id = :token_colegio_id
                             // ORDER BY m.generated_date DESC
  calcularResumen();         // total_fines, total_amount, paid_count, pending_count, pending_amount
  retornarDatos();           // retorna { parent_id, parent_name, total_fines, total_amount,
                             //   paid_count, pending_count, pending_amount, fines: [...] }
}
```
