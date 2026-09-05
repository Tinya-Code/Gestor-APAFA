# A7 M5 — DTOs — Eventos

**#1 — GET /events** — Listar eventos — Retorna: Datos

**Reglas de dominio**

- Filtros de fecha opcionales
- Accesible por todos los roles autenticados

```ts
// Entrada
interface ListarEventosQuery {
  page?: number;
  limit?: number;
  date_from?: string;
  date_to?: string;
}

// Salida
interface EventoEnLista {
  id: number;
  title: string;
  date: string;
  description: string | null;
  generates_fine: boolean;
  fine_amount: number | null;
  generates_attendance: boolean;
  generates_expense: boolean;
  generates_contribution: boolean;
  contribution_amount: number | null;
}

interface ListarEventosResponse {
  data: EventoEnLista[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

---

**#2 — GET /events/:id** — Obtener evento por id — Retorna: Datos

**Reglas de dominio**

- Retorna configuración completa del evento

```ts
// Entrada: id del evento (path param)

// Salida
interface EventoDetalle {
  id: number;
  assembly_id: number | null;
  title: string;
  date: string;
  description: string | null;
  generates_fine: boolean;
  fine_amount: number | null;
  generates_attendance: boolean;
  generates_expense: boolean;
  generates_contribution: boolean;
  contribution_amount: number | null;
  created_at: string;
}

interface EventoDetalleResponse {
  data: EventoDetalle;
}
```

---

**#3 — POST /events** — Registrar evento — Retorna: Datos

**Reglas de dominio**

- title y date son obligatorios
- Si generates_fine=true, fine_amount debe ser > 0
- Si generates_contribution=true, contribution_amount debe ser > 0
- Los flags booleanos default a false

```ts
// Entrada
interface NuevoEventoDto {
  assembly_id?: number;
  title: string;
  date: string;
  description?: string;
  generates_fine?: boolean;
  fine_amount?: number;
  generates_attendance?: boolean;
  generates_expense?: boolean;
  generates_contribution?: boolean;
  contribution_amount?: number;
}

// Salida
interface NuevoEventoResponse {
  data: {
    id: number;
    assembly_id: number | null;
    title: string;
    date: string;
    description: string | null;
    generates_fine: boolean;
    fine_amount: number | null;
    generates_attendance: boolean;
    generates_expense: boolean;
    generates_contribution: boolean;
    contribution_amount: number | null;
    created_at: string;
  };
}
```

---

**#4 — PUT /events/:id** — Actualizar evento — Retorna: Datos

**Reglas de dominio**

- Patch parcial

```ts
// Entrada
interface ActualizarEventoDto {
  assembly_id?: number;
  title?: string;
  date?: string;
  description?: string;
  generates_fine?: boolean;
  fine_amount?: number;
  generates_attendance?: boolean;
  generates_expense?: boolean;
  generates_contribution?: boolean;
  contribution_amount?: number;
}

// Salida: Mismo formato que POST
```

---

**#5 — DELETE /events/:id** — Eliminar evento — Retorna: Mensaje

**Reglas de dominio**

- Solo administradores (N1)
- Borra lógicamente en cascada: evento + asistencias + multas

```ts
// Entrada: id del evento (path param)

// Salida
interface EliminarEventoResponse {
  data: {
    message: string;
  };
}
```
