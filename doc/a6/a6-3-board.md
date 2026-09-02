# A6 M3 — Directiva

---

## GET `/api/v1/board-members`

**Descripción:** Lista miembros de la directiva.

**Actores:** N1–N4

**Pseudocódigo:**

```javascript
function listBoardMembers(page, limit) {
  // Recibe: paginación

  // Consulta: miembros de la directiva
  // Incluye: nombre del padre vinculado y rol

  // Devuelve: lista de miembros paginada
}
```

**Parámetros de consulta:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| page | integer | No | Número de página |
| limit | integer | No | Resultados por página |

**Respuesta (200):**

```json
{
  "data": [
    {
      "id": 1,
      "parent_id": 5,
      "parent_name": "Carlos López",
      "role": "president",
      "start_date": "2025-03-01",
      "end_date": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "total_pages": 1
  }
}
```

---

## GET `/api/v1/board-members/:id`

**Descripción:** Retorna el detalle de un miembro de la directiva.

**Actores:** N1–N4

**Pseudocódigo:**

```javascript
function getBoardMember(memberId) {
  // Recibe: id del miembro

  // Consulta: datos del miembro directivo
  // Consulta: información del padre vinculado

  // Devuelve: el miembro con datos de su padre
}
```

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del miembro |

**Respuesta (200):**

```json
{
  "data": {
    "id": 1,
    "parent_id": 5,
    "parent": {
      "id": 5,
      "name": "Carlos",
      "surname": "López",
      "dni": "28765432"
    },
    "role": "president",
    "start_date": "2025-03-01",
    "end_date": null
  }
}
```

---

## POST `/api/v1/board-members`

**Descripción:** Registra un nuevo miembro de la directiva.

**Actores:** N1, N2

**Pseudocódigo:**

```javascript
function createBoardMember(data) {
  // Recibe: id del padre, rol y fecha de inicio

  // Valida: que el padre exista
  // Valida: que no haya otro miembro activo con el mismo rol
  // Valida: que los campos obligatorios estén presentes

  // Procesa: crea el registro del miembro directivo

  // Devuelve: el miembro creado con su id
}
```

**Cuerpo de la solicitud:**

```json
{
  "parent_id": 5,
  "role": "president",
  "start_date": "2025-03-01"
}
```

| Campo | Tipo | Requerido | Descripción |
| ------- | ------ | ----------- | ------------- |
| parent_id | integer | ✅ | ID del padre que ocupa el cargo |
| role | string | ✅ | Rol (admin, president, vice_president, treasurer, secretary) |
| start_date | string | ✅ | Fecha de inicio (YYYY-MM-DD) |
| end_date | string | No | Fecha de fin (null si está activo) |

**Respuesta (201):** Objeto miembro con `id` y `created_at`.

---

## PUT `/api/v1/board-members/:id`

**Descripción:** Edita un miembro de la directiva.

**Actores:** N1, N2

**Pseudocódigo:**

```javascript
function updateBoardMember(memberId, data) {
  // Recibe: id del miembro y campos a actualizar

  // Valida: que el miembro exista

  // Procesa: actualiza solo los campos proporcionados

  // Devuelve: el miembro actualizado
}
```

**Cuerpo de la solicitud:** Igual que POST (todos los campos opcionales).

**Respuesta (200):** Objeto miembro actualizado.

---

## DELETE `/api/v1/board-members/:id`

**Descripción:** Elimina un miembro de la directiva.

**Actores:** N1

**Pseudocódigo:**

```javascript
function deleteBoardMember(memberId) {
  // Recibe: id del miembro

  // Valida: que el usuario sea administrador (N1)
  // Valida: que el miembro exista

  // Procesa: elimina el registro del miembro

  // Devuelve: confirmación de eliminación
}
```

**Respuesta (200):**

```json
{
  "data": {
    "message": "Miembro de directiva eliminado exitosamente"
  }
}
```
