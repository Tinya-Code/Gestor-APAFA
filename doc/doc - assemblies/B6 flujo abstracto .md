

## **#1 — GET /assemblies** — Listar asambleas — 
>Retorna: Datos


```ts
obtenerAsamblea {
  RD.verificarExistencia()   // valida si asamblea existe y
                             // si pertenece al colegio
  consultarAsamblea()        // trae asamblea con sus detalles
  retorna: Datos
}
```

---

## **#2 — GET /assemblies/:id** — Obtener asamblea por id — 
>Retorna: Datos


```ts
obtenerAsamblea {
  RD.asambleaExiste()  // valida si asamblea existe y si pertenece al colegio
  consultarAsamblea()  // trae asamblea con sus detalles
  retorna: Datos
}

```

---

## **#3 — POST /assemblies** — Registrar asamblea — 
>Retorna: Datos

```ts
registrarAsamblea {
  insertarAsamblea()         // inserta nueva asamblea vinculada al colegio
  retorna: Datos
}
```

---

## **#4 — PUT /assemblies/:id** — Actualizar asamblea — 
>Retorna: Datos

```ts
actualizarAsamblea {
  RD.asambleaExiste()    // valida si asamblea existe y pertenece al colegio
  actualizarAsamblea()   // actualiza los campos enviados
  retorna: Datos
}
```

---

## **#5 — DELETE /assemblies/:id** — Eliminar asamblea — 
>Retorna: Mensaje

```ts
eliminarAsamblea {
  RD.asambleaExiste()    // valida si asamblea existe y pertenece al colegio
  eliminarAsamblea()     // marca deleted_at en la asamblea
  retorna: Mensaje
}
```

---

## **#6 — POST /assemblies/:id/details** — Registrar detalle/acuerdo — 
>Retorna: Datos

```ts
registrarDetalle {
  RD.asambleaExiste()    // valida si asamblea esta activa, existe y
						 // pertenece al colegio
  insertarDetalle()      // inserta detalle vinculado a la asamblea
  retorna: Datos
}
```

---

## **#7 — PUT /assemblies/:id/details/:detailId** — Actualizar detalle — 
>Retorna: Datos

```ts
actualizarDetalle {
  RD.asambleaExiste()    // valida si asamblea existe y pertenece al colegio
  RD.detalleExiste()     // verifica que el detalle pertenezca a la asamblea
  actualizarDetalle()    // actualiza los campos enviados
  retorna: Datos
}
```

---

## **#8 — DELETE /assemblies/:id/details/:detailId** — Eliminar detalle — 
>Retorna: Mensaje

```ts
eliminarDetalle {
  RD.asambleaExiste()    // valida si asamblea existe y pertenece al colegio
  RD.detalleExiste()     // verifica que el detalle pertenezca a la asamblea
  eliminarDetalle()      // marca deleted_at en el detalle
  retorna: Mensaje
}
```

---
