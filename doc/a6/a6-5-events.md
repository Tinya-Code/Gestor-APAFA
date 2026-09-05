# A6 M5 — Eventos

**#1 — GET /events** — Listar eventos — Retorna: Datos

```
listarEventos {
  parsearPaginacion();       // page=1, limit=20 por defecto
  parsearFiltros();          // dateFrom y dateTo opcionales (YYYY-MM-DD)
  construirConsulta();       // SELECT * FROM evento WHERE deleted_at IS NULL
                             // Si dateFrom: AND date >= ?
                             // Si dateTo: AND date <= ?
                             // ORDER BY date DESC
  ejecutarPaginado();        // ejecuta con LIMIT/OFFSET, cuenta total
  retornarDatos();           // retorna lista con todos los flags de configuración
}
```

**#2 — GET /events/:id** — Obtener evento por id — Retorna: Datos

```
detalleEvento {
  RD.eventoExiste();         // el evento existe en la base de datos
  buscarEvento();            // SELECT * FROM evento WHERE id = ? AND deleted_at IS NULL
  retornarDatos();           // retorna { id, assembly_id, title, date, description, generates_fine,
                             //   fine_amount, generates_attendance, generates_expense,
                             //   generates_contribution, contribution_amount, created_at }
}
```

**#3 — POST /events** — Registrar evento — Retorna: Datos

```
nuevoEvento {
  RD.nuevoEvento();          // title y date son obligatorios; formato YYYY-MM-DD
  RD.validarMontos();        // si generates_fine=true, fine_amount debe ser > 0
                             // si generates_contribution=true, contribution_amount debe ser > 0
  insertarEvento();          // INSERT INTO evento (assembly_id, title, date, description, generates_fine,
                             //   fine_amount, generates_attendance, generates_expense, generates_contribution,
                             //   contribution_amount, created_at, updated_at)
                             // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  retornarDatos();           // retorna evento con id y created_at
}
```

**#4 — PUT /events/:id** — Actualizar evento — Retorna: Datos

```
actualizarEvento {
  RD.eventoExiste();         // el evento existe en la base de datos
  validarCambios();          // solo actualiza campos presentes (patch parcial)
  actualizarCampos();        // UPDATE evento SET title=COALESCE(?,title), date=COALESCE(?,date),
                             //   description=COALESCE(?,description), generates_fine=COALESCE(?,generates_fine),
                             //   fine_amount=COALESCE(?,fine_amount), generates_attendance=COALESCE(?,generates_attendance),
                             //   generates_expense=COALESCE(?,generates_expense), generates_contribution=COALESCE(?,generates_contribution),
                             //   contribution_amount=COALESCE(?,contribution_amount), updated_at=NOW()
                             //   WHERE id = ?
  retornarDatos();           // retorna evento actualizado
}
```

**#5 — DELETE /events/:id** — Eliminar evento — Retorna: Mensaje

```
eliminarEvento {
  RD.adminOnly();            // solo administradores (N1)
  RD.eventoExiste();         // el evento existe en la base de datos
  borrarLogicoCascada();     // UPDATE evento SET deleted_at = NOW() WHERE id = ?
                             // UPDATE asistencia SET deleted_at = NOW() WHERE event_id = ?
                             // UPDATE multa SET deleted_at = NOW() WHERE event_id = ?
  retornarMensaje();         // retorna "Evento eliminado exitosamente"
}
```
