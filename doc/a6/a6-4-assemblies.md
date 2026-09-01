# A6 M4 — Asambleas

---

## GET `/api/v1/assemblies`

**Descripción:** Lista asambleas.

**Actores:** N1–N4

**Pseudocódigo:**
```javascript
function listAssemblies(page, limit, dateFrom, dateTo) {
  // Recibe: paginación y filtros opcionales de fecha

  // Consulta: asambleas en la base de datos
  // Aplica filtros de fecha si se proporcionan
  // Incluye: cantidad de detalles registrados

  // Devuelve: lista de asambleas paginada
}
```

**Parámetros de consulta:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| page | integer | No | Número de página |
| limit | integer | No | Resultados por página |
| date_from | string | No | Filtrar desde fecha (YYYY-MM-DD) |
| date_to | string | No | Filtrar hasta fecha (YYYY-MM-DD) |

**Respuesta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Asamblea Anual 2026",
      "date": "2026-03-15",
      "description": "Revisión anual y aprobación de presupuesto",
      "details_count": 3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "total_pages": 1
  }
}
```

---

## GET `/api/v1/assemblies/:id`

**Descripción:** Retorna el detalle de una asamblea con sus detalles anidados.

**Actores:** N1–N4

**Pseudocódigo:**
```javascript
function getAssembly(assemblyId) {
  // Recibe: id de la asamblea

  // Consulta: datos de la asamblea
  // Consulta: todos los detalles/acuerdos registrados

  // Devuelve: la asamblea con su lista de detalles
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID de la asamblea |

**Respuesta (200):**
```json
{
  "data": {
    "id": 1,
    "title": "Asamblea Anual 2026",
    "date": "2026-03-15",
    "description": "Revisión anual y aprobación de presupuesto",
    "details": [
      {
        "id": 1,
        "description": "Presupuesto anual aprobado: $50.000",
        "registration_date": "2026-03-15",
        "image_url": "https://..."
      }
    ]
  }
}
```

---

## POST `/api/v1/assemblies`

**Descripción:** Registra una nueva asamblea.

**Actores:** N1, N2

**Pseudocódigo:**
```javascript
function createAssembly(data) {
  // Recibe: título, fecha y descripción

  // Valida: que los campos obligatorios estén presentes

  // Procesa: crea el registro de la asamblea

  // Devuelve: la asamblea creada con su id
}
```

**Cuerpo de la solicitud:**
```json
{
  "title": "Asamblea Anual 2026",
  "date": "2026-03-15",
  "description": "Revisión anual y aprobación de presupuesto"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| title | string | ✅ | Título de la asamblea |
| date | string | ✅ | Fecha (YYYY-MM-DD) |
| description | string | No | Descripción |

**Respuesta (201):** Objeto asamblea con `id` y `created_at`.

---

## PUT `/api/v1/assemblies/:id`

**Descripción:** Edita una asamblea.

**Actores:** N1, N2

**Pseudocódigo:**
```javascript
function updateAssembly(assemblyId, data) {
  // Recibe: id de la asamblea y campos a actualizar

  // Valida: que la asamblea exista

  // Procesa: actualiza solo los campos proporcionados

  // Devuelve: la asamblea actualizada
}
```

**Cuerpo de la solicitud:** Igual que POST (todos los campos opcionales).

**Respuesta (200):** Objeto asamblea actualizado.

---

## DELETE `/api/v1/assemblies/:id`

**Descripción:** Elimina una asamblea.

**Actores:** N1

**Pseudocódigo:**
```javascript
function deleteAssembly(assemblyId) {
  // Recibe: id de la asamblea

  // Valida: que el usuario sea administrador (N1)
  // Valida: que la asamblea exista

  // Procesa: elimina la asamblea y sus detalles (CASCADE)

  // Devuelve: confirmación de eliminación
}
```

**Respuesta (200):**
```json
{
  "data": {
    "message": "Asamblea eliminada exitosamente"
  }
}
```

---

## POST `/api/v1/assemblies/:id/details`

**Descripción:** Registra un detalle/acuerdo en una asamblea.

**Actores:** N1, N2, N4

**Pseudocódigo:**
```javascript
function createAssemblyDetail(assemblyId, data) {
  // Recibe: id de la asamblea, descripción y opcionalmente URL de imagen

  // Valida: que la asamblea exista
  // Valida: que la descripción esté presente

  // Procesa: crea el detalle vinculado a la asamblea
  // Registra automáticamente la fecha de registro

  // Devuelve: el detalle creado con su id y fecha
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID de la asamblea |

**Cuerpo de la solicitud:**
```json
{
  "description": "Presupuesto anual aprobado: $50.000",
  "image_url": "https://..."
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| description | string | ✅ | Descripción del acuerdo/nota |
| image_url | string | No | Foto del acta |

**Respuesta (201):** Objeto detalle con `id` y `registration_date`.

---

## PUT `/api/v1/assemblies/:id/details/:detailId`

**Descripción:** Edita un detalle de asamblea.

**Actores:** N1, N2, N4

**Pseudocódigo:**
```javascript
function updateAssemblyDetail(assemblyId, detailId, data) {
  // Recibe: ids de asamblea y detalle, campos a actualizar

  // Valida: que la asamblea y el detalle existan

  // Procesa: actualiza el detalle

  // Devuelve: el detalle actualizado
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID de la asamblea |
| detailId | integer | ID del detalle |

**Cuerpo de la solicitud:** Igual que POST (todos los campos opcionales).

**Respuesta (200):** Objeto detalle actualizado.

---

## DELETE `/api/v1/assemblies/:id/details/:detailId`

**Descripción:** Elimina un detalle de asamblea.

**Actores:** N1, N2

**Pseudocódigo:**
```javascript
function deleteAssemblyDetail(assemblyId, detailId) {
  // Recibe: ids de asamblea y detalle

  // Valida: que la asamblea y el detalle existan

  // Procesa: elimina el registro del detalle

  // Devuelve: confirmación de eliminación
}
```

**Respuesta (200):**
```json
{
  "data": {
    "message": "Detalle de asamblea eliminado exitosamente"
  }
}
```
