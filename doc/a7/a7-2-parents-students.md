# A7 M2 — DTOs — Padres y Estudiantes

## Padres

**#1 — GET /parents** — Listar padres con paginación — Retorna: Datos

**Reglas de dominio**

- Paginación por defecto: page=1, limit=20
- Búsqueda por nombre, apellido o DNI (case-insensitive LIKE)
- Solo retorna padres no borrados lógicamente

```ts
// Entrada
interface ListarPadresQuery {
  page?: number;
  limit?: number;
  search?: string;
}

// Salida
interface PadreEnLista {
  id: number;
  name: string;
  surname: string;
  dni: string;
  phone: string | null;
  email: string | null;
  students_count: number;
}

interface ListarPadresResponse {
  data: PadreEnLista[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

---

**#2 — GET /parents/:id** — Obtener padre por id — Retorna: Datos

**Reglas de dominio**

- Retorna padre con todos sus estudiantes vinculados
- 404 si el padre no existe o está borrado

```ts
// Entrada: id del padre (path param)

// Salida
interface EstudianteResumen {
  id: number;
  name: string;
  surname: string;
  grade: string;
  section: string;
}

interface PadreDetalle {
  id: number;
  name: string;
  surname: string;
  dni: string;
  phone: string | null;
  email: string | null;
  students: EstudianteResumen[];
}

interface PadreDetalleResponse {
  data: PadreDetalle;
}
```

---

**#3 — POST /parents** — Registrar nuevo padre — Retorna: Datos

**Reglas de dominio**

- DNI debe ser único entre padres activos
- name, surname y dni son obligatorios
- phone y email son opcionales

```ts
// Entrada
interface NuevoPadreDto {
  name: string;
  surname: string;
  dni: string;
  phone?: string;
  email?: string;
}

// Salida
interface NuevoPadreResponse {
  data: {
    id: number;
    name: string;
    surname: string;
    dni: string;
    phone: string | null;
    email: string | null;
    created_at: string;
  };
}
```

---

**#4 — PUT /parents/:id** — Actualizar padre — Retorna: Datos

**Reglas de dominio**

- Solo actualiza campos proporcionados (patch parcial)
- Si cambia el DNI, debe ser único

```ts
// Entrada
interface ActualizarPadreDto {
  name?: string;
  surname?: string;
  dni?: string;
  phone?: string;
  email?: string;
}

// Salida: Mismo formato que POST
```

---

**#5 — DELETE /parents/:id** — Eliminar padre — Retorna: Mensaje

**Reglas de dominio**

- Solo administradores (N1) pueden eliminar
- No se puede eliminar padre con estudiantes activos vinculados
- Borrado lógico (deleted_at)

```ts
// Entrada: id del padre (path param)

// Salida
interface EliminarPadreResponse {
  data: {
    message: string;
  };
}
```

---

## Estudiantes

**#6 — GET /students** — Listar estudiantes con filtros — Retorna: Datos

**Reglas de dominio**

- Filtros opcionales: grade, section, parent_id
- Incluye nombre del padre vinculado

```ts
// Entrada
interface ListarEstudiantesQuery {
  page?: number;
  limit?: number;
  grade?: string;
  section?: string;
  parent_id?: number;
}

// Salida
interface EstudianteEnLista {
  id: number;
  name: string;
  surname: string;
  grade: string;
  section: string;
  parent_id: number;
  parent_name: string;
}

interface ListarEstudiantesResponse {
  data: EstudianteEnLista[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

---

**#7 — GET /students/:id** — Obtener estudiante por id — Retorna: Datos

**Reglas de dominio**

- Retorna estudiante con información de su padre

```ts
// Entrada: id del estudiante (path param)

// Salida
interface EstudianteDetalle {
  id: number;
  name: string;
  surname: string;
  grade: string;
  section: string;
  parent_id: number;
  parent: {
    id: number;
    name: string;
    surname: string;
  };
}

interface EstudianteDetalleResponse {
  data: EstudianteDetalle;
}
```

---

**#8 — POST /students** — Registrar nuevo estudiante — Retorna: Datos

**Reglas de dominio**

- Todos los campos son obligatorios
- El padre referenciado debe existir

```ts
// Entrada
interface NuevoEstudianteDto {
  name: string;
  surname: string;
  grade: string;
  section: string;
  parent_id: number;
}

// Salida
interface NuevoEstudianteResponse {
  data: {
    id: number;
    name: string;
    surname: string;
    grade: string;
    section: string;
    parent_id: number;
    created_at: string;
  };
}
```

---

**#9 — PUT /students/:id** — Actualizar estudiante — Retorna: Datos

**Reglas de dominio**

- Patch parcial, solo actualiza campos proporcionados

```ts
// Entrada
interface ActualizarEstudianteDto {
  name?: string;
  surname?: string;
  grade?: string;
  section?: string;
}

// Salida: Mismo formato que POST
```

---

**#10 — DELETE /students/:id** — Eliminar estudiante — Retorna: Mensaje

**Reglas de dominio**

- Solo administradores (N1)
- Borrado lógico

```ts
// Entrada: id del estudiante (path param)

// Salida
interface EliminarEstudianteResponse {
  data: {
    message: string;
  };
}
```

---

**#11 — PATCH /students/:id/parent** — Reasignar estudiante a otro padre — Retorna: Datos

**Reglas de dominio**

- Reasigna un estudiante a otro padre
- Ambos (estudiante y nuevo padre) deben existir

```ts
// Entrada
interface ReasignarPadreDto {
  parent_id: number;
}

// Salida: Mismo formato que POST con nuevo parent_id
```
