# A7 M4 — DTOs — Asambleas (Multi-Tenant)

> **Multi-Tenant:** Todos los DTOs asumen `colegio_id` del token JWT.

## Asambleas

**#1 — GET /assemblies** — Listar asambleas — Retorna: Datos

**Reglas de dominio**

- Filtros de fecha opcionales (date_from, date_to)
- Solo retorna asambleas DEL COLEGIO

```ts
// Entrada
interface ListarAsambleasQuery {
  page?: number;
  limit?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
}

// Salida
interface AsambleaEnLista {
  id: number;
  title: string;
  date: string;
  description: string | null;
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

// Salida (objeto directo, sin wrapper)
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

// Salida (objeto directo, sin wrapper)
interface NuevaAsambleaResponse {
  id: number;
  title: string;
  date: string;
  description: string | null;
  created_at: string;
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

- Solo Super Admin o Presidente
- Borra lógicamente en cascada: asamblea + detalles

```ts
// Entrada: id de la asamblea (path param)

// Salida (objeto directo, sin wrapper)
interface EliminarAsambleaResponse {
  message: string;
}
```

---

## Detalles de Asamblea

**#6 — POST /assemblies/:id/details** — Registrar detalle/acuerdo — Retorna: Datos

**Reglas de dominio**

- La asamblea debe existir
- description es obligatorio
- registration_date es obligatorio (formato YYYY-MM-DD)

```ts
// Entrada
interface NuevoDetalleDto {
  description: string;
  registration_date: string;  // YYYY-MM-DD, obligatorio
  image_url?: string;
}

// Salida (objeto directo, sin wrapper)
interface NuevoDetalleResponse {
  id: number;
  assembly_id: number;
  description: string;
  registration_date: string;
  image_url: string | null;
  created_at: string;
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
  registration_date?: string;
  image_url?: string;
}

// Salida: Mismo formato que POST
```

---

**#8 — DELETE /assemblies/:id/details/:detailId** — Eliminar detalle — Retorna: Mensaje

**Reglas de dominio**

- Solo Super Admin o Presidente
- El detalle debe pertenecer a la asamblea Y AL COLEGIO

```ts
// Entrada: id de asamblea y id del detalle (path params)

// Salida (objeto directo, sin wrapper)
interface EliminarDetalleResponse {
  message: string;
}
```
