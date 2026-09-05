# A7 M8 — DTOs — Ingresos

**#1 — GET /income** — Listar ingresos — Retorna: Datos

**Reglas de dominio**

- Filtros: type (donation, fine, contribution, fee), date range, parent_id
- Solo directivos (N1, N2, N3)

```ts
// Entrada
interface ListarIngresosQuery {
  page?: number;
  limit?: number;
  type?: string;
  date_from?: string;
  date_to?: string;
  parent_id?: number;
}

// Salida
interface IngresoEnLista {
  id: number;
  parent_id: number;
  parent_name: string;
  event_id: number | null;
  event_title: string | null;
  board_member_id: number;
  amount: number;
  date: string;
  description: string | null;
  type: string;
}

interface ListarIngresosResponse {
  data: IngresoEnLista[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

---

**#2 — GET /income/:id** — Obtener ingreso por id — Retorna: Datos

**Reglas de dominio**

- Retorna ingreso con padre, evento y directivo

```ts
// Entrada: id del ingreso (path param)

// Salida
interface IngresoDetalle {
  id: number;
  parent_id: number;
  parent: {
    id: number;
    name: string;
    surname: string;
  };
  event_id: number | null;
  event: {
    id: number;
    title: string;
  } | null;
  board_member_id: number;
  board_member_name: string;
  amount: number;
  date: string;
  description: string | null;
  type: string;
}

interface IngresoDetalleResponse {
  data: IngresoDetalle;
}
```

---

**#3 — POST /income** — Registrar ingreso — Retorna: Datos

**Reglas de dominio**

- parent_id, amount, date y type son obligatorios
- type debe ser: donation, fine, contribution, fee
- amount debe ser > 0
- Crea automáticamente un movimiento asociado (type: ingreso)

```ts
// Entrada
interface NuevoIngresoDto {
  parent_id: number;
  event_id?: number;
  amount: number;
  date: string;
  description?: string;
  type: string;
}

// Salida
interface NuevoIngresoResponse {
  data: {
    id: number;
    parent_id: number;
    event_id: number | null;
    board_member_id: number;
    amount: number;
    date: string;
    description: string | null;
    type: string;
    created_at: string;
  };
}
```

---

**#4 — PUT /income/:id** — Editar ingreso — Retorna: Datos

**Reglas de dominio**

- Patch parcial

```ts
// Entrada
interface ActualizarIngresoDto {
  amount?: number;
  date?: string;
  description?: string;
  type?: string;
}

// Salida: Mismo formato que POST
```

---

**#5 — DELETE /income/:id** — Eliminar ingreso — Retorna: Mensaje

**Reglas de dominio**

- Solo administradores (N1)
- Borra lógicamente ingreso + movimiento asociado

```ts
// Entrada: id del ingreso (path param)

// Salida
interface EliminarIngresoResponse {
  data: {
    message: string;
  };
}
```

---

**#6 — GET /parents/:id/income** — Historial de ingresos de un padre — Retorna: Datos

**Reglas de dominio**

- Historial de ingresos de un padre ordenado por fecha descendente

```ts
// Entrada
interface HistorialIngresosQuery {
  page?: number;
  limit?: number;
}

// Salida
interface IngresoHistorial {
  id: number;
  event_title: string | null;
  amount: number;
  date: string;
  type: string;
  description: string | null;
}

interface HistorialIngresosResponse {
  data: IngresoHistorial[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

---

**#7 — GET /income/totals-panel** — Panel de totales — Retorna: Datos

**Reglas de dominio**

- Retorna totales: recaudado, pendiente, desglose por tipo y por mes
- Solo directivos

```ts
// Entrada: Ninguna

// Salida
interface PanelTotales {
  total_collected: number;
  total_pending: number;
  by_type: {
    donation: number;
    fine: number;
    contribution: number;
    fee: number;
  };
  by_month: {
    month: string;
    collected: number;
    pending: number;
  }[];
}

interface PanelTotalesResponse {
  data: PanelTotales;
}
```

---

**#8 — GET /parents/:id/financial-status** — Estado financiero por padre — Retorna: Datos

**Reglas de dominio**

- Estado financiero combinado: ingresos totales + multas (pagadas/pendientes) + balance

```ts
// Entrada: id del padre (path param)

// Salida
interface EstadoFinanciero {
  parent_id: number;
  parent_name: string;
  income: {
    total: number;
    count: number;
  };
  fines: {
    total: number;
    pending: number;
    paid: number;
    count: number;
  };
  balance: number;
}

interface EstadoFinancieroResponse {
  data: EstadoFinanciero;
}
```
