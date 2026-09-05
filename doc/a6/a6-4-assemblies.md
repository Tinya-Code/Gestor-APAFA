# A6 M4 — Asambleas

## Asambleas

**#1 — GET /assemblies** — Listar asambleas — Retorna: Datos

```
listarAsambleas {
  parsearPaginacion();       // page=1, limit=20 por defecto
  parsearFiltros();          // dateFrom y dateTo opcionales (YYYY-MM-DD)
  construirConsulta();       // SELECT a.*, COUNT(da.id) as details_count FROM asamblea a
                             // LEFT JOIN detalle_asamblea da ON da.assembly_id = a.id AND da.deleted_at IS NULL
                             // WHERE a.deleted_at IS NULL
                             // Si dateFrom: AND a.date >= ?
                             // Si dateTo: AND a.date <= ?
                             // GROUP BY a.id ORDER BY a.date DESC
  ejecutarPaginado();        // ejecuta con LIMIT/OFFSET, cuenta total
  retornarDatos();           // retorna { data: [...], pagination: { page, limit, total, total_pages } }
}
```

**#2 — GET /assemblies/:id** — Obtener asamblea por id — Retorna: Datos

```
detalleAsamblea {
  RD.asambleaExiste();       // la asamblea existe en la base de datos
  buscarAsamblea();          // SELECT * FROM asamblea WHERE id = ? AND deleted_at IS NULL
  buscarDetalles();          // SELECT * FROM detalle_asamblea WHERE assembly_id = ? AND deleted_at IS NULL
                             // ORDER BY registration_date
  retornarDatos();           // retorna { id, title, date, description, details: [...] }
}
```

**#3 — POST /assemblies** — Registrar asamblea — Retorna: Datos

```
nuevaAsamblea {
  RD.nuevaAsamblea();        // title y date son obligatorios; formato YYYY-MM-DD
  insertarAsamblea();        // INSERT INTO asamblea (title, date, description, created_at, updated_at)
                             // VALUES (?, ?, ?, NOW(), NOW())
  retornarDatos();           // retorna { id, title, date, description, created_at }
}
```

**#4 — PUT /assemblies/:id** — Actualizar asamblea — Retorna: Datos

```
actualizarAsamblea {
  RD.asambleaExiste();       // la asamblea existe en la base de datos
  validarCambios();          // solo actualiza campos presentes (patch parcial)
  actualizarCampos();        // UPDATE asamblea SET title=COALESCE(?,title), date=COALESCE(?,date),
                             //   description=COALESCE(?,description), updated_at=NOW() WHERE id = ?
  retornarDatos();           // retorna asamblea actualizada
}
```

**#5 — DELETE /assemblies/:id** — Eliminar asamblea — Retorna: Mensaje

```
eliminarAsamblea {
  RD.adminOnly();            // solo administradores (N1)
  RD.asambleaExiste();       // la asamblea existe en la base de datos
  borrarLogicoCascada();     // UPDATE asamblea SET deleted_at = NOW() WHERE id = ?
                             // UPDATE detalle_asamblea SET deleted_at = NOW() WHERE assembly_id = ?
  retornarMensaje();         // retorna "Asamblea eliminada exitosamente"
}
```

## Detalles de Asamblea

**#6 — POST /assemblies/:id/details** — Registrar detalle/acuerdo — Retorna: Datos

```
nuevoDetalle {
  RD.asambleaExiste();       // la asamblea debe existir
  RD.nuevoDetalle();         // description es obligatorio
  insertarDetalle();         // INSERT INTO detalle_asamblea (assembly_id, description, registration_date, image_url, created_at, updated_at)
                             // VALUES (?, ?, CURDATE(), ?, NOW(), NOW())
                             // registration_date se asigna automáticamente con la fecha actual
  retornarDatos();           // retorna { id, assembly_id, description, registration_date, image_url }
}
```

**#7 — PUT /assemblies/:id/details/:detailId** — Actualizar detalle — Retorna: Datos

```
actualizarDetalle {
  RD.asambleaExiste();       // la asamblea debe existir
  RD.detalleExiste();        // el detalle debe existir y pertenecer a la asamblea
  actualizarCampos();        // UPDATE detalle_asamblea SET description=COALESCE(?,description),
                             //   image_url=COALESCE(?,image_url), updated_at=NOW() WHERE id = ?
  retornarDatos();           // retorna detalle actualizado
}
```

**#8 — DELETE /assemblies/:id/details/:detailId** — Eliminar detalle — Retorna: Mensaje

```
eliminarDetalle {
  RD.adminODirectivo();      // solo administradores (N1) o directivos
  RD.asambleaExiste();       // la asamblea debe existir
  RD.detalleExiste();        // el detalle debe existir y pertenecer a la asamblea
  borrarLogico();            // UPDATE detalle_asamblea SET deleted_at = NOW() WHERE id = ?
  retornarMensaje();         // retorna "Detalle de asamblea eliminado exitosamente"
}
```
