# A6 M3 — Directiva (Multi-Tenant)

> **Multi-Tenant:** Todas las queries incluyen `WHERE colegio_id = :token_colegio_id` y los INSERT incluyen `colegio_id`.

**#1 — GET /board-members** — Listar miembros de la directiva — Retorna: Datos

```
listarDirectiva {
  parsearPaginacion();       // page=1, limit=20 por defecto
  construirConsulta();       // SELECT d.*, CONCAT(p.name, ' ', p.surname) as parent_name
                             // FROM directiva d JOIN padre p ON p.id = d.parent_id
                             // WHERE d.deleted_at IS NULL AND p.deleted_at IS NULL
                             //   AND d.colegio_id = :token_colegio_id
                             // ORDER BY d.start_date DESC
  ejecutarPaginado();        // ejecuta con LIMIT/OFFSET, cuenta total
  retornarDatos();           // retorna { data: [...], pagination: { page, limit, total, total_pages } }
}
```

**#2 — GET /board-members/:id** — Obtener miembro por id — Retorna: Datos

```
detalleMiembro {
  RD.miembroExiste();        // el miembro existe en la base de datos Y PERTENECE AL COLEGIO
  buscarMiembro();           // SELECT * FROM directiva WHERE id = ? AND deleted_at IS NULL AND colegio_id = :token_colegio_id
  buscarPadre();             // SELECT id, name, surname, dni FROM padre WHERE id = ? AND colegio_id = :token_colegio_id
  retornarDatos();           // retorna { id, parent_id, parent: {...}, role, start_date, end_date }
}
```

**#3 — POST /board-members** — Registrar nuevo miembro — Retorna: Datos

```
nuevoMiembro {
  RD.nuevoMiembro();         // parent_id, role, start_date son obligatorios
  RD.rolValido();            // role debe ser: admin_colegio, presidente, vicepresidente, tesorero, secretario
  RD.padreExiste();          // el padre referenciado debe existir Y PERTENECE AL COLEGIO
  RD.sinRolDuplicado();     // no puede haber dos miembros activos con el mismo rol POR COLEGIO
  insertarMiembro();         // INSERT INTO directiva (parent_id, role, start_date, end_date, colegio_id, created_at, updated_at)
                             // VALUES (?, ?, ?, NULL, :token_colegio_id, NOW(), NOW())
  retornarDatos();           // retorna { id, parent_id, role, start_date, end_date: null, created_at }
}
```

**#4 — PUT /board-members/:id** — Actualizar miembro — Retorna: Datos

```
actualizarMiembro {
  RD.miembroExiste();        // el miembro existe en la base de datos Y PERTENECE AL COLEGIO
  validarCambios();          // solo actualiza campos presentes (patch parcial)
  actualizarCampos();        // UPDATE directiva SET role=COALESCE(?,role), start_date=COALESCE(?,start_date),
                             //   end_date=COALESCE(?,end_date), updated_at=NOW()
                             //   WHERE id = ? AND colegio_id = :token_colegio_id
  retornarDatos();           // retorna miembro actualizado
}
```

**#5 — DELETE /board-members/:id** — Eliminar miembro — Retorna: Mensaje

```
eliminarMiembro {
  RD.adminOnly();            // solo administradores (N0, N1)
  RD.miembroExiste();        // el miembro existe en la base de datos Y PERTENECE AL COLEGIO
  borrarLogico();            // UPDATE directiva SET deleted_at = NOW() WHERE id = ? AND colegio_id = :token_colegio_id
  retornarMensaje();         // retorna "Miembro de directiva eliminado exitosamente"
}
```
