
## **#1 — GET /assemblies** — Listar asambleas — 
>Retorna: Datos

```ts
listarAsambleas {
  extraerLista() {
    asambleaList.repository()  // query dinámica con filtros opcionales
							   // devuelve rows y total
    totalPages()        // shared helper, calcula total_pages con el total
  }
  respuesta             // arma ListarAsambleasResponse con rows + pagination
  retorna: Datos
}
```

Query:

```sql
SELECT 
  a.id, 
  a.title, 
  a.date, 
  a.description, 
  COUNT(d.id) as details_count
FROM asamblea a
LEFT JOIN detalle_asamblea d 
  ON d.assembly_id = a.id 
  AND d.deleted_at IS NULL       -- [FIJO] excluye detalles borrados
WHERE a.colegio_id = ?           -- [FIJO] siempre viene del token
  AND a.deleted_at IS NULL       -- [FIJO] excluye asambleas borradas
  AND a.date >= ?                -- [DINÁMICO] solo si viene date_from
  AND a.date <= ?                -- [DINÁMICO] solo si viene date_to
GROUP BY a.id 
ORDER BY a.date DESC 
LIMIT ?                          -- [FIJO] viene del input, default 10
OFFSET ?                         -- [CALCULADO] (page - 1) * limit
```


---

## **#2 — GET /assemblies/:id** — Obtener asamblea por id — 
>Retorna: Datos

```ts
obtenerAsamblea {
  RD.asambleaExiste()        // valida existencia y pertenencia al colegio
  consultarAsamblea() {
    asamblea.repository()    // trae asamblea con detalles activos anidados
  }
  respuesta                  // arma ObtenerAsambleaResponse
  retorna: Datos
}
```

Query :

```sql
SELECT 
  a.id, a.title, a.date, a.description,
  d.id               AS detail_id,
  d.description      AS detail_description,
  d.registration_date,
  d.image_url
FROM asamblea a
LEFT JOIN detalle_asamblea d ON d.assembly_id = a.id AND d.deleted_at IS NULL
WHERE a.id = ? AND a.deleted_at IS NULL AND a.colegio_id = ?
```

---

## **#3 — POST /assemblies** — Registrar asamblea — 
>Retorna: Datos

```ts
registrarAsamblea {
  insertarAsamblea() {
    asamblea.repository()    // inserta nueva asamblea vinculada al colegio
  }
  respuesta                  // arma CrearAsambleaResponse
  retorna: Datos
}
```

Query :

```sql
INSERT INTO asamblea (colegio_id, title, date, description)
VALUES (?, ?, ?, ?)
```

---

## **#4 — PUT /assemblies/:id** — Actualizar asamblea — 
>Retorna: Datos

```ts
actualizarAsamblea {
  RD.asambleaExiste()        // valida existencia y pertenencia al colegio
  actualizarAsamblea() {
    asamblea.repository()    // actualiza los campos enviados
  }
  respuesta                  // arma ActualizarAsambleaResponse
  retorna: Datos
}
```

Query :

```sql
UPDATE asamblea
SET title = ?, date = ?, description = ?
WHERE id = ? AND colegio_id = ? AND deleted_at IS NULL
```

---

## **#5 — DELETE /assemblies/:id** — Eliminar asamblea — 
>Retorna: Mensaje

```ts
eliminarAsamblea {
  RD.asambleaExiste()        // valida existencia y pertenencia al colegio
  eliminarAsamblea() {
    asamblea.repository()    // marca deleted_at en la asamblea
  }
  respuesta                  // arma EliminarAsambleaResponse
  retorna: Mensaje
}
```

Query :

```sql
UPDATE asamblea
SET deleted_at = NOW()
WHERE id = ? AND colegio_id = ? AND deleted_at IS NULL
```

> El control de roles (N0, N1) no se documenta aquí — en NestJS los guards (`@Roles()`, `@UseGuards()`) lo resuelven a nivel de ruta, antes de llegar al caso de uso.

---

## **#6 — POST /assemblies/:id/details** — Registrar detalle/acuerdo — 
>Retorna: Datos

```ts
registrarDetalle {
  RD.asambleaExiste()        // valida existencia y pertenencia al colegio
  insertarDetalle() {
    detalle.repository()     // inserta detalle vinculado a la asamblea
  }
  respuesta                  // arma CrearDetalleResponse
  retorna: Datos
}
```

Query :

```sql
INSERT INTO detalle_asamblea (assembly_id, colegio_id, description, registration_date, image_url)
VALUES (?, ?, ?, CURDATE(), ?)
```

---

## **#7 — PUT /assemblies/:id/details/:detailId** — Actualizar detalle — 
>Retorna: Datos

```ts
actualizarDetalle {
  RD.asambleaExiste()     // valida existencia y pertenencia al colegio
  RD.detalleExiste()      // verifica que el detalle pertenezca a la asamblea
  actualizarDetalle() {
    detalle.repository()     // actualiza los campos enviados
  }
  respuesta                  // arma ActualizarDetalleResponse
  retorna: Datos
}
```

Query :

```sql
UPDATE detalle_asamblea
SET description = ?, image_url = ?
WHERE id = ? AND assembly_id = ? AND deleted_at IS NULL
```

---

## **#8 — DELETE /assemblies/:id/details/:detailId** — Eliminar detalle — 
>Retorna: Mensaje

```ts
eliminarDetalle {
  RD.asambleaExiste()        // valida existencia y pertenencia al colegio
  RD.detalleExiste()         // verifica que el detalle pertenezca a la asamblea
  eliminarDetalle() {
    detalle.repository()     // marca deleted_at en el detalle
  }
  respuesta                  // arma EliminarDetalleResponse
  retorna: Mensaje
}
```

Query :

```sql
UPDATE detalle_asamblea
SET deleted_at = NOW()
WHERE id = ? AND assembly_id = ? AND colegio_id = ? AND deleted_at IS NULL
```

---
