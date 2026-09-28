

---
# MÓDULO  ASAMBLEAS 
---
---


# 1 — GET /assemblies — Listar asambleas
---
---

```ts
export interface ListarAsambleasInput {
  colegio_id: number;
  page?: number;
  limit?: number;
  date_from?: string;
  date_to?: string;
}


export interface AsambleaEnLista {
  id: number;
  title: string;
  date: string;
  description: string | null;
  details_count: number;
}

export interface PaginacionMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ListarAsambleasResponse {
  data: AsambleaEnLista[];
  pagination: PaginacionMeta;
}
```

---

# 2 — GET /assemblies/:id — Obtener asamblea por ID
---
---
```ts
export interface ObtenerAsambleaInput {
  id: number;
  colegio_id: number;
}

export interface DetalleAsambleaItem {
  id: number;
  description: string;
  registration_date: string;
  image_url: string | null;
}

export interface AsambleaConDetalles {
  id: number;
  title: string;
  date: string;
  description: string | null;
  details: DetalleAsambleaItem[];
}

export interface ObtenerAsambleaResponse {
  data: AsambleaConDetalles;
}
```

---

# 3 — POST /assemblies — Registrar asamblea
---
---

```ts
export interface CrearAsambleaInput {
  colegio_id: number;
  title: string;
  date: string;
  description?: string;
}

export interface AsambleaCreada {
  id: number;
  title: string;
  date: string;
  description: string | null;
}

export interface CrearAsambleaResponse {
  data: AsambleaCreada;
}
```

----

# 4 — PATCH /assemblies/:id — Actualizar asamblea
---
---

```ts
export interface ActualizarAsambleaInput {
  id: number;
  colegio_id: number;
  title?: string;
  date?: string;
  description?: string;
}

export interface ActualizarAsambleaResponse {
  data: { id: number };
}
```

---

# 5 — DELETE /assemblies/:id — Eliminar asamblea
---
---

```ts
export interface EliminarAsambleaInput {
  id: number;
  colegio_id: number;
  usuario_id: number;
}

export interface MensajeRespuesta {
  message: string;
}

export interface EliminarAsambleaResponse {
  data: MensajeRespuesta;
}
```

---

# 6 — POST /assemblies/:id/details — Registrar detalle/acuerdo
---
---

```ts
export interface CrearDetalleInput {
  assembly_id: number;
  colegio_id: number;
  description: string;
  image_url?: string;
}

export interface DetalleCreado {
  id: number;
  assembly_id: number;
  description: string;
  registration_date: string;
  image_url: string | null;
}

export interface CrearDetalleResponse {
  data: DetalleCreado;
}
```

---

# 7 — PATCH /assemblies/:id/details/:detailId — Actualizar detalle
---
---

```ts
export interface ActualizarDetalleInput {
  assembly_id: number;
  detail_id: number;
  colegio_id: number;
  description?: string;
  image_url?: string;
}

export interface ActualizarDetalleResponse {
  data: { id: number };
}
```

---

# 8 — DELETE /assemblies/:id/details/:detailId — Eliminar detalle
---
---

```ts
export interface EliminarDetalleInput {
  assembly_id: number;
  detail_id: number;
  colegio_id: number;
  usuario_id: number;
}

export interface EliminarDetalleResponse {
  data: MensajeRespuesta;
}
```