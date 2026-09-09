# A6 M6 — Asistencias (Multi-Tenant)

> **Multi-Tenant:** Todas las queries incluyen `WHERE colegio_id = :token_colegio_id` y los INSERT incluyen `colegio_id`.

**#1 — GET /events/:id/attendance** — Listar asistencias de un evento — Retorna: Datos

```
listarAsistencias {
  RD.eventoExiste();         // el evento debe existir Y PERTENECE AL COLEGIO
  parsearPaginacion();       // page=1, limit=20 por defecto
  construirConsulta();       // SELECT a.*, CONCAT(p.name, ' ', p.surname) as parent_name
                             // FROM asistencia a JOIN padre p ON p.id = a.parent_id
                             // WHERE a.event_id = ? AND a.deleted_at IS NULL
                             //   AND a.colegio_id = :token_colegio_id
                             // ORDER BY a.registration_date DESC
  ejecutarPaginado();        // ejecuta con LIMIT/OFFSET, cuenta total
  retornarDatos();           // retorna { data: [...], pagination: { page, limit, total, total_pages } }
}
```

**#2 — POST /events/:id/attendance** — Registrar asistencia — Retorna: Datos

```
nuevaAsistencia {
  RD.eventoExiste();         // el evento debe existir Y PERTENECE AL COLEGIO
  RD.padreExiste();          // el padre debe existir Y PERTENECE AL COLEGIO
  RD.noDuplicada();          // no puede haber dos registros para el mismo padre/evento EN EL COLEGIO
  insertarAsistencia();      // INSERT INTO asistencia (event_id, parent_id, attended, registration_date, colegio_id, created_at, updated_at)
                             // VALUES (?, ?, ?, CURDATE(), :token_colegio_id, NOW(), NOW())
  retornarDatos();           // retorna { id, event_id, parent_id, attended, registration_date }
}
```

**#3 — PUT /events/:id/attendance/:attendanceId** — Editar asistencia — Retorna: Datos

```
actualizarAsistencia {
  RD.asistenciaExiste();     // la asistencia debe existir y pertenecer al evento Y AL COLEGIO
  actualizarCampos();        // UPDATE asistencia SET attended = ?, updated_at = NOW()
                             // WHERE id = ? AND colegio_id = :token_colegio_id
  retornarDatos();           // retorna asistencia actualizada
}
```
