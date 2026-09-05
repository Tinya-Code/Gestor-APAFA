# A7 M6 — DTOs — Asistencias

**#1 — GET /events/:id/attendance** — Listar asistencias de un evento — Retorna: Datos

**Reglas de dominio**

- El evento debe existir
- Lista registros de asistencia con nombre del padre

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

- No puede haber dos registros de asistencia para el mismo padre en el mismo evento
- El padre y el evento deben existir
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

- La asistencia debe existir y pertenecer al evento

```ts
// Entrada
interface ActualizarAsistenciaDto {
  attended: boolean;
}

// Salida: Mismo formato que POST
```
