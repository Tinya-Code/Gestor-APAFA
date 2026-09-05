# A7 M11 — DTOs — Avisos

**#1 — GET /notices** — Listar avisos — Retorna: Datos

**Reglas de dominio**

- Avisos de solo lectura, generados automáticamente
- Filtro opcional por type (event, fine)

```ts
// Entrada
interface ListarAvisosQuery {
  page?: number;
  limit?: number;
  type?: string;
}

// Salida
interface AvisoEnLista {
  id: number;
  type: string;
  reference_id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface ListarAvisosResponse {
  data: AvisoEnLista[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

---

**#2 — GET /notices/:id** — Obtener aviso por id — Retorna: Datos

**Reglas de dominio**

- Retorna aviso completo con created_at

```ts
// Entrada: id del aviso (path param)

// Salida
interface AvisoDetalle {
  id: number;
  type: string;
  reference_id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
  created_at: string;
}

interface AvisoDetalleResponse {
  data: AvisoDetalle;
}
```

> Los avisos son de solo lectura. Se crean automáticamente cuando:
> - M5 (Eventos) crea un evento con `generates_contribution: true`
> - M7 (Multas) genera multas vía `POST /fines/generate`
>
> No hay endpoints de escritura para avisos expuestos a los usuarios.
