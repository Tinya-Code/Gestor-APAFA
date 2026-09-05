# A7 M4 — DTOs — Asambleas

## Asambleas

**#1 — GET /assemblies** — Listar asambleas — Retorna: Datos

**Reglas de dominio**

- Filtros de fecha opcionales (date_from, date_to)
- Incluye conteo de detalles registrados

```ts
// Entrada
interface ListarAsambleasQuery {
  page?: number;
  limit?: number;
  date_from?: string;
  date_to?: string;
}

// Salida
interface AsambleaEnLista {
  id: number;
  title: string;
  date: string;
  description: string | null;
  details_count: number;
}

interface ListarAsambleasResponse {
  data: AsambleaEnLista[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

---

**#2 — GET /assemblies/:id** — Obtener asamblea por id — Retorna: Datos

**Reglas de dominio**

- Retorna asamblea con detalles/acuerdos anidados

```ts
// Entrada: id de la asamblea (path param)

// Salida
interface DetalleAsamblea {
  id: number;
  title: string;
  date: string;
  description: string | null;
  details: {
    id: number;
    description: string;
    registration_date: string;
    image_url: string | null;
  }[];
}

interface AsambleaDetalleResponse {
  data: DetalleAsamblea;
}
```

---

**#3 — POST /assemblies** — Registrar asamblea — Retorna: Datos

**Reglas de dominio**

- title y date son obligatorios
- Fecha debe ser formato YYYY-MM-DD

```ts
// Entrada
interface NuevaAsambleaDto {
  title: string;
  date: string;
  description?: string;
}

// Salida
interface NuevaAsambleaResponse {
  data: {
    id: number;
    title: string;
    date: string;
    description: string | null;
    created_at: string;
  };
}
```

---

**#4 — PUT /assemblies/:id** — Actualizar asamblea — Retorna: Datos

**Reglas de dominio**

- Patch parcial

```ts
// Entrada
interface ActualizarAsambleaDto {
  title?: string;
  date?: string;
  description?: string;
}

// Salida: Mismo formato que POST
```

---

**#5 — DELETE /assemblies/:id** — Eliminar asamblea — Retorna: Mensaje

**Reglas de dominio**

- Solo administradores (N1)
- Borra lógicamente en cascada: asamblea + detalles

```ts
// Entrada: id de la asamblea (path param)

// Salida
interface EliminarAsambleaResponse {
  data: {
    message: string;
  };
}
```

---

## Detalles de Asamblea

**#6 — POST /assemblies/:id/details** — Registrar detalle/acuerdo — Retorna: Datos

**Reglas de dominio**

- La asamblea debe existir
- description es obligatorio
- registration_date se asigna automáticamente con la fecha actual

```ts
// Entrada
interface NuevoDetalleDto {
  description: string;
  image_url?: string;
}

// Salida
interface NuevoDetalleResponse {
  data: {
    id: number;
    assembly_id: number;
    description: string;
    registration_date: string;
    image_url: string | null;
    created_at: string;
  };
}
```

---

**#7 — PUT /assemblies/:id/details/:detailId** — Actualizar detalle — Retorna: Datos

**Reglas de dominio**

- El detalle debe pertenecer a la asamblea

```ts
// Entrada
interface ActualizarDetalleDto {
  description?: string;
  image_url?: string;
}

// Salida: Mismo formato que POST
```

---

**#8 — DELETE /assemblies/:id/details/:detailId** — Eliminar detalle — Retorna: Mensaje

**Reglas de dominio**

- Solo administradores o directivos
- El detalle debe pertenecer a la asamblea

```ts
// Entrada: id de asamblea y id del detalle (path params)

// Salida
interface EliminarDetalleResponse {
  data: {
    message: string;
  };
}
```
