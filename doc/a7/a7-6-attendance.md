# A7 M6 — DTOs — Asistencias (Multi-Tenant)

> **Multi-Tenant:** Todos los DTOs asumen `colegio_id` del token JWT.

**#1 — GET /events/:id/attendance** — Listar asistencias de un evento — Retorna: Datos

**Reglas de dominio**

- El evento debe existir Y PERTENECER AL COLEGIO
- Lista registros de asistencia con nombre del padre DEL COLEGIO

```ts
// Entrada
interface ListarAsistenciasQuery {
  page?: number;
  limit?: number;
}

// Salida
interface AsistenciaEnLista {
  id: number;
  event_id: number;
  parent_id: number;
  parent_name: string;
  attended: boolean;
  registration_date: string;
}

interface ListarAsistenciasResponse {
  data: AsistenciaEnLista[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

---

**#2 — POST /events/:id/attendance** — Registrar asistencia — Retorna: Datos

**Reglas de dominio**

- No puede haber dos registros de asistencia para el mismo padre en el mismo evento POR COLEGIO
- El padre y el evento deben existir Y PERTENECER AL COLEGIO
- attended es booleano

```ts
// Entrada
interface NuevaAsistenciaDto {
  parent_id: number;
  attended: boolean;
}

// Salida
interface NuevaAsistenciaResponse {
  data: {
    id: number;
    event_id: number;
    parent_id: number;
    attended: boolean;
    registration_date: string;
    created_at: string;
  };
}
```

---

**#3 — PUT /events/:id/attendance/:attendanceId** — Editar asistencia — Retorna: Datos

**Reglas de dominio**

- La asistencia debe existir y pertenecer al evento Y AL COLEGIO

```ts
// Entrada
interface ActualizarAsistenciaDto {
  attended: boolean;
}

// Salida: Mismo formato que POST
```
