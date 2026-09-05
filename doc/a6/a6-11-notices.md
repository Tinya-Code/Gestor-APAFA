# A6 M11 — Avisos

**#1 — GET /notices** — Listar avisos — Retorna: Datos

```
listarAvisos {
  parsearPaginacion();       // page=1, limit=20 por defecto
  parsearFiltros();          // type (event, fine) opcional
  construirConsulta();       // SELECT * FROM aviso WHERE deleted_at IS NULL
                             // Si type: AND type = ?
                             // ORDER BY date DESC
  ejecutarPaginado();        // ejecuta con LIMIT/OFFSET, cuenta total
  retornarDatos();           // retorna { data: [...], pagination: { page, limit, total, total_pages } }
}
```

**#2 — GET /notices/:id** — Obtener aviso por id — Retorna: Datos

```
detalleAviso {
  RD.avisoExiste();          // el aviso existe en la base de datos
  buscarAviso();             // SELECT * FROM aviso WHERE id = ? AND deleted_at IS NULL
  retornarDatos();           // retorna { id, type, reference_id, title, message, date, read, created_at }
}
```

> Los avisos son de solo lectura. Se crean automáticamente cuando:
> - M5 (Eventos) crea un evento con `generates_contribution: true`
> - M7 (Multas) genera multas vía `POST /fines/generate`
>
> No hay endpoints de escritura para avisos expuestos a los usuarios.
