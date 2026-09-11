# A7 M3 — DTOs — Directiva (Multi-Tenant)

> **Multi-Tenant:** Todos los DTOs asumen `colegio_id` del token JWT.

## Mandatos de Directiva

**#1 — GET /directiva** — Listar miembros de la directiva — Retorna: Datos

**Reglas de dominio**

- Lista miembros activos de la directiva DEL COLEGIO
- Incluye nombre del padre vinculado

```ts
// Entrada
interface ListarDirectivaQuery {
  page?: number;
  limit?: number;
  role?: string;
  current?: boolean;
  is_active?: boolean;
}

// Salida
interface MiembroEnLista {
  id: number;
  parent_id: number;
  parent_name: string;
  parent_surname: string;
  parent_dni: string;
  role: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: number;
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

**#2 — GET /directiva/:id** — Obtener miembro por id — Retorna: Datos

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
  notes: string | null;
  is_active: number;
}

interface MiembroDetalleResponse {
  data: MiembroDetalle;
}
```

---

**#3 — POST /directiva** — Registrar nuevo miembro — Retorna: Datos

**Reglas de dominio**

- No puede haber dos miembros activos con el mismo rol POR COLEGIO (end_date IS NULL)
- El padre referenciado debe existir Y PERTENECER AL COLEGIO
- role debe ser uno de: presidente, vicepresidente, tesorero, secretario, vocal

```ts
// Entrada
interface NuevoMiembroDto {
  parent_id: number;
  role: string;
  start_date: string;
  end_date?: string;
  notes?: string;
}

// Salida
interface NuevoMiembroResponse {
  data: {
    id: number;
    parent_id: number;
    role: string;
    start_date: string;
    end_date: string | null;
    notes: string | null;
    is_active: number;
    created_at: string;
  };
}
```

---

**#4 — PUT /directiva/:id** — Actualizar miembro — Retorna: Datos

**Reglas de dominio**

- Patch parcial
- Si se cambia end_date, se marca como inactivo

```ts
// Entrada
interface ActualizarMiembroDto {
  parent_id?: number;
  role?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  is_active?: boolean;
}

// Salida: Mismo formato que POST
```

---

**#5 — DELETE /directiva/:id** — Eliminar miembro — Retorna: Mensaje

**Reglas de dominio**

- Solo administradores (N0, N1)
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

---

## Reemplazos Temporales

**#6 — GET /directiva/reemplazos** — Listar reemplazos — Retorna: Datos

**Reglas de dominio**

- Lista reemplazos del colegio (activos e históricos)
- Incluye nombres del vocal, directivo reemplazado y quien autorizó

```ts
// Entrada
interface ListarReemplazosQuery {
  page?: number;
  limit?: number;
  replaced_role?: string;
  vocal_parent_id?: number;
  is_active?: boolean;
  current?: boolean;
}

// Salida
interface ReemplazoEnLista {
  id: number;
  vocal_parent_id: number;
  vocal_name: string;
  vocal_surname: string;
  replaced_role: string;
  replaced_parent_id: number;
  replaced_name: string;
  replaced_surname: string;
  effective_role: string;
  start_date: string;
  end_date: string | null;
  reason: string | null;
  is_active: number;
  created_by_name: string;
  created_by_surname: string;
  created_at: string;
}

interface ListarReemplazosResponse {
  data: ReemplazoEnLista[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

---

**#7 — GET /directiva/reemplazos/:id** — Obtener reemplazo por id — Retorna: Datos

**Reglas de dominio**

- Retorna reemplazo con datos completos

```ts
// Entrada: id del reemplazo (path param)

// Salida: Mismo formato que ReemplazoEnLista
```

---

**#8 — POST /directiva/reemplazos** — Crear reemplazo temporal — Retorna: Datos

**Reglas de dominio**

- Solo presidente o super_admin pueden autorizar
- El vocal debe ser vocal activo en el colegio
- El directivo a reemplazar debe tener el rol indicado y estar activo
- No puede ser el mismo padre (vocal ≠ reemplazado)
- No puede haber otro reemplazo activo para el mismo rol
- No puede haber otro reemplazo activo para el mismo vocal

```ts
// Entrada
interface CrearReemplazoDto {
  vocal_parent_id: number;
  replaced_role: string;  // presidente | vicepresidente | tesorero | secretario
  replaced_parent_id: number;
  start_date: string;     // ISO 8601
  end_date?: string;      // ISO 8601, NULL = indefinido
  reason?: string;
}

// Salida
interface CrearReemplazoResponse {
  data: ReemplazoEnLista;
}
```

---

**#9 — PUT /directiva/reemplazos/:id** — Actualizar reemplazo — Retorna: Datos

**Reglas de dominio**

- Solo presidente o super_admin pueden modificar
- Puede extender fecha, cambiar motivo o desactivar

```ts
// Entrada
interface ActualizarReemplazoDto {
  end_date?: string;
  reason?: string;
  is_active?: boolean;
}

// Salida: Mismo formato que CrearReemplazoResponse
```

---

**#10 — DELETE /directiva/reemplazos/:id** — Finalizar reemplazo — Retorna: Mensaje

**Reglas de dominio**

- Solo presidente o super_admin pueden finalizar
- Desactiva el reemplazo y marca fecha de fin
- El vocal vuelve a su estado de solo lectura

```ts
// Entrada: id del reemplazo (path param)

// Salida
interface FinalizarReemplazoResponse {
  data: {
    message: string;
  };
}
```
