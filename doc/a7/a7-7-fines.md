# A7 M7 — DTOs — Multas

**#1 — GET /fines** — Listar multas — Retorna: Datos

**Reglas de dominio**

- Filtros opcionales: parent_id, event_id, paid
- Incluye nombre del padre y título del evento

```ts
// Entrada
interface ListarMultasQuery {
  page?: number;
  limit?: number;
  parent_id?: number;
  event_id?: number;
  paid?: boolean;
}

// Salida
interface MultaEnLista {
  id: number;
  parent_id: number;
  parent_name: string;
  event_id: number;
  event_title: string;
  amount: number;
  paid: boolean;
  generated_date: string;
  payment_date: string | null;
}

interface ListarMultasResponse {
  data: MultaEnLista[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

---

**#2 — GET /fines/:id** — Obtener multa por id — Retorna: Datos

**Reglas de dominio**

- Retorna multa con padre y evento completos

```ts
// Entrada: id de la multa (path param)

// Salida
interface MultaDetalle {
  id: number;
  parent_id: number;
  parent: {
    id: number;
    name: string;
    surname: string;
  };
  event_id: number;
  event: {
    id: number;
    title: string;
  };
  amount: number;
  paid: boolean;
  generated_date: string;
  payment_date: string | null;
}

interface MultaDetalleResponse {
  data: MultaDetalle;
}
```

---

**#3 — POST /fines** — Registrar multa manual — Retorna: Datos

**Reglas de dominio**

- parent_id, event_id y amount son obligatorios
- amount debe ser > 0
- paid inicia en false
- generated_date se asigna automáticamente

```ts
// Entrada
interface NuevaMultaDto {
  parent_id: number;
  event_id: number;
  amount: number;
}

// Salida
interface NuevaMultaResponse {
  data: {
    id: number;
    parent_id: number;
    event_id: number;
    amount: number;
    paid: boolean;
    generated_date: string;
    payment_date: string | null;
    created_at: string;
  };
}
```

---

**#4 — POST /fines/generate** — Generar multas automáticas — Retorna: Datos

**Reglas de dominio**

- El evento debe tener generates_fine=true
- Genera multas por cada padre ausente (attended=false)
- No duplica multas ya existentes para el mismo evento/padre
- Retorna cantidad de multas generadas

```ts
// Entrada
interface GenerarMultasDto {
  event_id: number;
}

// Salida
interface GenerarMultasResponse {
  data: {
    generated: number;
    event_id: number;
    message: string;
  };
}
```

---

**#5 — PUT /fines/:id** — Editar multa — Retorna: Datos

**Reglas de dominio**

- Si paid=true, payment_date debe estar presente
- amount debe ser > 0 si se envía

```ts
// Entrada
interface ActualizarMultaDto {
  amount?: number;
  paid?: boolean;
  payment_date?: string;
}

// Salida: Mismo formato que POST
```

---

**#6 — DELETE /fines/:id** — Eliminar multa — Retorna: Mensaje

**Reglas de dominio**

- Solo administradores (N1)
- Borrado lógico

```ts
// Entrada: id de la multa (path param)

// Salida
interface EliminarMultaResponse {
  data: {
    message: string;
  };
}
```

---

**#7 — GET /parents/:id/fines** — Estado de multas de un padre — Retorna: Datos

**Reglas de dominio**

- Retorna resumen de multas: totales, pagadas, pendientes
- Incluye lista de multas individuales

```ts
// Entrada: id del padre (path param)

// Salida
interface MultaResumen {
  id: number;
  event_title: string;
  amount: number;
  paid: boolean;
  payment_date: string | null;
}

interface EstadoMultasPadre {
  parent_id: number;
  parent_name: string;
  total_fines: number;
  total_amount: number;
  paid_count: number;
  pending_count: number;
  pending_amount: number;
  fines: MultaResumen[];
}

interface EstadoMultasPadreResponse {
  data: EstadoMultasPadre;
}
```
