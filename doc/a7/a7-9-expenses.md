# A7 M9 — DTOs — Gastos

## Gastos

**#1 — GET /expenses** — Listar gastos — Retorna: Datos

**Reglas de dominio**

- Filtros: type, date range
- Solo directivos (N1, N2, N3)

```ts
// Entrada
interface ListarGastosQuery {
  page?: number;
  limit?: number;
  type?: string;
  date_from?: string;
  date_to?: string;
}

// Salida
interface GastoEnLista {
  id: number;
  event_id: number | null;
  event_title: string | null;
  receipt_id: number;
  receipt_number: string;
  board_member_id: number;
  total: number;
  type: string;
  date: string;
  description: string | null;
}

interface ListarGastosResponse {
  data: GastoEnLista[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

---

**#2 — GET /expenses/:id** — Obtener gasto por id — Retorna: Datos

**Reglas de dominio**

- Retorna gasto con comprobante e items anidados

```ts
// Entrada: id del gasto (path param)

// Salida
interface ItemGasto {
  id: number;
  description: string;
  amount: number;
}

interface GastoDetalle {
  id: number;
  event_id: number | null;
  event_title: string | null;
  receipt: {
    id: number;
    board_member_id: number;
    number: string;
    type: string;
    date: string;
    description: string | null;
  };
  items: ItemGasto[];
  total: number;
  type: string;
  date: string;
  description: string | null;
}

interface GastoDetalleResponse {
  data: GastoDetalle;
}
```

---

**#3 — POST /expenses** — Registrar gasto — Retorna: Datos

**Reglas de dominio**

- receipt_id, total, type y date son obligatorios
- total debe ser > 0
- Crea automáticamente un movimiento asociado (type: egreso)

```ts
// Entrada
interface NuevoGastoDto {
  event_id?: number;
  receipt_id: number;
  total: number;
  type: string;
  date: string;
  description?: string;
}

// Salida
interface NuevoGastoResponse {
  data: {
    id: number;
    event_id: number | null;
    receipt_id: number;
    board_member_id: number;
    total: number;
    type: string;
    date: string;
    description: string | null;
    created_at: string;
  };
}
```

---

**#4 — PUT /expenses/:id** — Editar gasto — Retorna: Datos

**Reglas de dominio**

- Patch parcial

```ts
// Entrada
interface ActualizarGastoDto {
  total?: number;
  type?: string;
  date?: string;
  description?: string;
}

// Salida: Mismo formato que POST
```

---

**#5 — DELETE /expenses/:id** — Eliminar gasto — Retorna: Mensaje

**Reglas de dominio**

- Solo administradores (N1)
- Borra lógicamente gasto + movimiento asociado

```ts
// Entrada: id del gasto (path param)

// Salida
interface EliminarGastoResponse {
  data: {
    message: string;
  };
}
```

---

## Comprobantes

**#6 — POST /receipts** — Registrar comprobante — Retorna: Datos

**Reglas de dominio**

- board_member_id, receipt_number, type y date son obligatorios
- receipt_number debe ser único entre comprobantes activos

```ts
// Entrada
interface NuevoComprobanteDto {
  board_member_id: number;
  receipt_number: string;
  type: string;
  date: string;
  description?: string;
}

// Salida
interface NuevoComprobanteResponse {
  data: {
    id: number;
    board_member_id: number;
    receipt_number: string;
    type: string;
    date: string;
    description: string | null;
    created_at: string;
  };
}
```

---

**#7 — PUT /receipts/:id** — Editar comprobante — Retorna: Datos

**Reglas de dominio**

- Patch parcial

```ts
// Entrada
interface ActualizarComprobanteDto {
  receipt_number?: string;
  type?: string;
  date?: string;
  description?: string;
}

// Salida: Mismo formato que POST
```

---

**#8 — DELETE /receipts/:id** — Eliminar comprobante — Retorna: Mensaje

**Reglas de dominio**

- Solo administradores (N1)
- Borra lógicamente comprobante + items (CASCADE)

```ts
// Entrada: id del comprobante (path param)

// Salida
interface EliminarComprobanteResponse {
  data: {
    message: string;
  };
}
```

---

## Items de Gasto

**#9 — POST /receipts/:id/items** — Registrar item de gasto — Retorna: Datos

**Reglas de dominio**

- El comprobante debe existir
- description y amount son obligatorios
- amount debe ser > 0

```ts
// Entrada
interface NuevoItemDto {
  description: string;
  amount: number;
}

// Salida
interface NuevoItemResponse {
  data: {
    id: number;
    receipt_id: number;
    description: string;
    amount: number;
    created_at: string;
  };
}
```

---

**#10 — PUT /receipts/:id/items/:itemId** — Editar item de gasto — Retorna: Datos

**Reglas de dominio**

- El item debe existir y pertenecer al comprobante

```ts
// Entrada
interface ActualizarItemDto {
  description?: string;
  amount?: number;
}

// Salida: Mismo formato que POST
```

---

**#11 — DELETE /receipts/:id/items/:itemId** — Eliminar item de gasto — Retorna: Mensaje

**Reglas de dominio**

- Solo administradores (N1)
- El item debe existir y pertenecer al comprobante

```ts
// Entrada: id de comprobante y id del item (path params)

// Salida
interface EliminarItemResponse {
  data: {
    message: string;
  };
}
```
