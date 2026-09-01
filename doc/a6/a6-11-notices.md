# A6 M11 — Avisos

---

## GET `/api/v1/notices`

**Descripción:** Lista avisos (generados desde eventos y multas).

**Actores:** N1–N5

**Pseudocódigo:**
```javascript
function listNotices(page, limit, type) {
  // Recibe: paginación y filtro opcional por tipo

  // Consulta: avisos en la base de datos
  // Aplica filtro de tipo si se proporciona

  // Devuelve: lista de avisos paginada
}
```

**Parámetros de consulta:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| page | integer | No | Número de página |
| limit | integer | No | Resultados por página |
| type | string | No | Filtrar por tipo: event o fine |

**Respuesta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "type": "event",
      "reference_id": 1,
      "title": "Nuevo Evento: Festival Escolar",
      "message": "Se ha creado un nuevo evento para el 10 de abril.",
      "date": "2026-01-10",
      "read": false
    },
    {
      "id": 2,
      "type": "fine",
      "reference_id": 3,
      "title": "Multa Generada",
      "message": "Se ha generado una multa de $5000 por inasistencia al Festival Escolar.",
      "date": "2026-04-11",
      "read": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "total_pages": 1
  }
}
```

---

## GET `/api/v1/notices/:id`

**Descripción:** Retorna el detalle de un aviso.

**Actores:** N1–N5

**Pseudocódigo:**
```javascript
function getNotice(noticeId) {
  // Recibe: id del aviso

  // Consulta: datos del aviso

  // Devuelve: el aviso completo
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del aviso |

**Respuesta (200):**
```json
{
  "data": {
    "id": 1,
    "type": "event",
    "reference_id": 1,
    "title": "Nuevo Evento: Festival Escolar",
    "message": "Se ha creado un nuevo evento para el 10 de abril. Se requieren aportes de $2000.",
    "date": "2026-01-10",
    "read": false,
    "created_at": "2026-01-10T08:00:00Z"
  }
}
```

**Nota:** Los avisos son de solo lectura para los usuarios. Se crean automáticamente cuando:
- M5 (Eventos) crea un evento con `generates_contribution: true`
- M7 (Multas) genera multas vía `POST /fines/generate`

No hay endpoints de escritura para avisos expuestos a los usuarios.
