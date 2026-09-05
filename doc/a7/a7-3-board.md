# A7 M3 — DTOs — Directiva

**#1 — GET /board-members** — Listar miembros de la directiva — Retorna: Datos

**Reglas de dominio**

- Lista miembros activos de la directiva
- Incluye nombre del padre vinculado

```ts
// Entrada
interface ListarDirectivaQuery {
  page?: number;
  limit?: number;
}

// Salida
interface MiembroEnLista {
  id: number;
  parent_id: number;
  parent_name: string;
  role: string;
  start_date: string;
  end_date: string | null;
}

interface ListarDirectivaResponse {
  data: MiembroEnLista[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

---

**#2 — GET /board-members/:id** — Obtener miembro por id — Retorna: Datos

**Reglas de dominio**

- Retorna miembro con datos del padre vinculado

```ts
// Entrada: id del miembro (path param)

// Salida
interface MiembroDetalle {
  id: number;
  parent_id: number;
  parent: {
    id: number;
    name: string;
    surname: string;
    dni: string;
  };
  role: string;
  start_date: string;
  end_date: string | null;
}

interface MiembroDetalleResponse {
  data: MiembroDetalle;
}
```

---

**#3 — POST /board-members** — Registrar nuevo miembro — Retorna: Datos

**Reglas de dominio**

- No puede haber dos miembros activos con el mismo rol (end_date IS NULL)
- El padre referenciado debe existir
- role debe ser uno de: admin, president, vice_president, treasurer, secretary

```ts
// Entrada
interface NuevoMiembroDto {
  parent_id: number;
  role: string;
  start_date: string;
  end_date?: string;
}

// Salida
interface NuevoMiembroResponse {
  data: {
    id: number;
    parent_id: number;
    role: string;
    start_date: string;
    end_date: string | null;
    created_at: string;
  };
}
```

---

**#4 — PUT /board-members/:id** — Actualizar miembro — Retorna: Datos

**Reglas de dominio**

- Patch parcial
- Si se cambia end_date, se marca como inactivo

```ts
// Entrada
interface ActualizarMiembroDto {
  role?: string;
  start_date?: string;
  end_date?: string;
}

// Salida: Mismo formato que POST
```

---

**#5 — DELETE /board-members/:id** — Eliminar miembro — Retorna: Mensaje

**Reglas de dominio**

- Solo administradores (N1)
- Borrado lógico

```ts
// Entrada: id del miembro (path param)

// Salida
interface EliminarMiembroResponse {
  data: {
    message: string;
  };
}
```
