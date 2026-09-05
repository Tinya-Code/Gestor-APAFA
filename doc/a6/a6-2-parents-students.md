# A6 M2 — Padres y Estudiantes

## Padres

**#1 — GET /parents** — Listar padres con paginación — Retorna: Datos

```
listarPadres {
  parsearPaginacion();       // page=1, limit=20 por defecto, valida positivos
  construirConsulta();       // SELECT p.*, COUNT(e.id) as students_count FROM padre p
                             // LEFT JOIN estudiante e ON e.parent_id = p.id AND e.deleted_at IS NULL
                             // WHERE p.deleted_at IS NULL
                             // Si search: AND (p.name LIKE ? OR p.surname LIKE ? OR p.dni LIKE ?)
                             // GROUP BY p.id ORDER BY p.surname, p.name
  ejecutarPaginado();        // ejecuta con LIMIT/OFFSET, cuenta total sin paginación
  retornarDatos();           // retorna { data: [...], pagination: { page, limit, total, total_pages } }
}
```

**#2 — GET /parents/:id** — Obtener padre por id — Retorna: Datos

```
detallePadre {
  RD.padreExiste();          // el padre existe en la base de datos y no está borrado
  buscarPadre();             // SELECT * FROM padre WHERE id = ? AND deleted_at IS NULL
  buscarEstudiantes();       // SELECT * FROM estudiante WHERE parent_id = ? AND deleted_at IS NULL
  retornarDatos();           // retorna { id, name, surname, dni, phone, email, students: [...] }
}
```

**#3 — POST /parents** — Registrar nuevo padre — Retorna: Datos

```
nuevoPadre {
  RD.nuevoPadre();           // name, surname y dni son obligatorios; dni es único entre activos
  verificarDuplicado();      // SELECT COUNT(*) FROM padre WHERE dni = ? AND deleted_at IS NULL
                             // Si ya existe: retorna 422 "DNI ya registrado"
  insertarPadre();           // INSERT INTO padre (name, surname, dni, phone, email, created_at, updated_at)
                             // VALUES (?, ?, ?, ?, ?, NOW(), NOW())
  retornarDatos();           // retorna { id, name, surname, dni, phone, email, created_at }
}
```

**#4 — PUT /parents/:id** — Actualizar padre — Retorna: Datos

```
actualizarPadre {
  RD.padreExiste();          // el padre existe en la base de datos
  validarCambios();          // solo actualiza campos presentes (patch parcial)
  verificarDuplicado();      // si cambia dni, debe ser único (excluye registro actual)
  actualizarCampos();        // UPDATE padre SET name=COALESCE(?,name), surname=COALESCE(?,surname),
                             //   dni=COALESCE(?,dni), phone=COALESCE(?,phone), email=COALESCE(?,email),
                             //   updated_at=NOW() WHERE id = ?
  retornarDatos();           // retorna padre actualizado
}
```

**#5 — DELETE /parents/:id** — Eliminar padre — Retorna: Mensaje

```
eliminarPadre {
  RD.adminOnly();            // solo administradores (N1) pueden eliminar
  RD.padreExiste();          // el padre existe en la base de datos
  RD.sinEstudiantes();       // no tiene estudiantes activos vinculados
  borrarLogico();            // UPDATE padre SET deleted_at = NOW() WHERE id = ?
  retornarMensaje();         // retorna "Padre eliminado exitosamente"
}
```

## Estudiantes

**#6 — GET /students** — Listar estudiantes con filtros — Retorna: Datos

```
listarEstudiantes {
  parsearPaginacion();       // page=1, limit=20 por defecto
  construirConsulta();       // SELECT s.*, CONCAT(p.name, ' ', p.surname) as parent_name
                             // FROM estudiante s JOIN padre p ON p.id = s.parent_id
                             // WHERE s.deleted_at IS NULL AND p.deleted_at IS NULL
                             // Si grade: AND s.grade = ?
                             // Si section: AND s.section = ?
                             // Si parentId: AND s.parent_id = ?
                             // ORDER BY s.surname, s.name
  ejecutarPaginado();        // ejecuta con LIMIT/OFFSET, cuenta total
  retornarDatos();           // retorna { data: [...], pagination: { page, limit, total, total_pages } }
}
```

**#7 — GET /students/:id** — Obtener estudiante por id — Retorna: Datos

```
detalleEstudiante {
  RD.estudianteExiste();     // el estudiante existe en la base de datos
  buscarEstudiante();        // SELECT * FROM estudiante WHERE id = ? AND deleted_at IS NULL
  buscarPadre();             // SELECT id, name, surname FROM padre WHERE id = ?
  retornarDatos();           // retorna { id, name, surname, grade, section, parent_id, parent: {...} }
}
```

**#8 — POST /students** — Registrar nuevo estudiante — Retorna: Datos

```
nuevoEstudiante {
  RD.nuevoEstudiante();      // name, surname, grade, section, parent_id son obligatorios
  RD.padreExiste();          // el padre referenciado debe existir y no estar borrado
  insertarEstudiante();      // INSERT INTO estudiante (name, surname, grade, section, parent_id, created_at, updated_at)
                             // VALUES (?, ?, ?, ?, ?, NOW(), NOW())
  retornarDatos();           // retorna { id, name, surname, grade, section, parent_id, created_at }
}
```

**#9 — PUT /students/:id** — Actualizar estudiante — Retorna: Datos

```
actualizarEstudiante {
  RD.estudianteExiste();     // el estudiante existe en la base de datos
  validarCambios();          // solo actualiza campos presentes (patch parcial)
  actualizarCampos();        // UPDATE estudiante SET name=COALESCE(?,name), surname=COALESCE(?,surname),
                             //   grade=COALESCE(?,grade), section=COALESCE(?,section), updated_at=NOW()
                             //   WHERE id = ?
  retornarDatos();           // retorna estudiante actualizado
}
```

**#10 — DELETE /students/:id** — Eliminar estudiante — Retorna: Mensaje

```
eliminarEstudiante {
  RD.adminOnly();            // solo administradores (N1)
  RD.estudianteExiste();     // el estudiante existe en la base de datos
  borrarLogico();            // UPDATE estudiante SET deleted_at = NOW() WHERE id = ?
  retornarMensaje();         // retorna "Estudiante eliminado exitosamente"
}
```

**#11 — PATCH /students/:id/parent** — Reasignar estudiante a otro padre — Retorna: Datos

```
reasignarPadre {
  RD.estudianteExiste();     // el estudiante existe en la base de datos
  RD.padreExiste();          // el nuevo padre existe en la base de datos
  actualizarVinculo();       // UPDATE estudiante SET parent_id = ?, updated_at = NOW() WHERE id = ?
  retornarDatos();           // retorna estudiante con nueva referencia al padre
}
```
