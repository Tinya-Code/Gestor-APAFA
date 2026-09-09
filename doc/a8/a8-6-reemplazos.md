# A8 M3 — Reemplazos Temporales de Directiva

**Endpoint:** `/api/v1/directiva/reemplazos`

> Permite que un vocal reemplace temporalmente a otro miembro de la directiva (ej: tesorero ausente).
> Solo el presidente o admin_colegio pueden autorizar reemplazos.

---

## GET `/directiva/reemplazos`

Listar reemplazos del colegio con filtros y paginación.

**Request:**
```
GET /api/v1/directiva/reemplazos HTTP/1.1
Authorization: Bearer <jwt>
```

**Query Parameters (opcionales):**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Número de página |
| `limit` | number | 10 | Elementos por página (máx 100) |
| `replaced_role` | string | - | Filtrar por rol reemplazado |
| `vocal_parent_id` | number | - | Filtrar por vocal que reemplaza |
| `is_active` | boolean | - | Solo reemplazos activos |
| `current` | boolean | - | Solo reemplazos vigentes |

**Ejemplo:**
```
GET /api/v1/directiva/reemplazos?current=true&is_active=true HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 200 OK:**
```json
{
  "data": [
    {
      "id": 1,
      "colegio_id": 1,
      "vocal_parent_id": 3,
      "vocal_name": "Carlos",
      "vocal_surname": "López",
      "replaced_role": "tesorero",
      "replaced_parent_id": 2,
      "replaced_name": "María",
      "replaced_surname": "Gómez",
      "effective_role": "tesorero",
      "start_date": "2025-09-07T10:00:00Z",
      "end_date": "2025-09-14T18:00:00Z",
      "reason": "Tesorera con licencia médica por una semana",
      "is_active": 1,
      "created_by_name": "Juan",
      "created_by_surname": "Pérez",
      "created_at": "2025-09-07T09:00:00Z",
      "updated_at": "2025-09-07T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "total_pages": 1
  }
}
```

---

## GET `/directiva/reemplazos/:id`

Obtener un reemplazo por ID.

**Request:**
```
GET /api/v1/directiva/reemplazos/1 HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 200 OK:**
```json
{
  "data": {
    "id": 1,
    "colegio_id": 1,
    "vocal_parent_id": 3,
    "vocal_name": "Carlos",
    "vocal_surname": "López",
    "replaced_role": "tesorero",
    "replaced_parent_id": 2,
    "replaced_name": "María",
    "replaced_surname": "Gómez",
    "effective_role": "tesorero",
    "start_date": "2025-09-07T10:00:00Z",
    "end_date": "2025-09-14T18:00:00Z",
    "reason": "Tesorera con licencia médica por una semana",
    "is_active": 1,
    "created_by_name": "Juan",
    "created_by_surname": "Pérez",
    "created_at": "2025-09-07T09:00:00Z",
    "updated_at": "2025-09-07T09:00:00Z"
  }
}
```

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Reemplazo no encontrado |

---

## POST `/directiva/reemplazos`

Crear un reemplazo temporal. Solo presidente o admin_colegio pueden autorizar.

**Request:**
```
POST /api/v1/directiva/reemplazos HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "vocal_parent_id": 3,
  "replaced_role": "tesorero",
  "replaced_parent_id": 2,
  "start_date": "2025-09-07T10:00:00",
  "end_date": "2025-09-14T18:00:00",
  "reason": "Tesorera con licencia médica por una semana"
}
```

**Body Fields:**

| Field | Required | Type | Max Length | Description |
|-------|----------|------|------------|-------------|
| `vocal_parent_id` | ✅ | number | - | ID del padre vocal que reemplazará |
| `replaced_role` | ✅ | string | 50 | Rol reemplazado: `vicepresidente`, `tesorero` o `secretario` |
| `replaced_parent_id` | ✅ | number | - | ID del padre directivo que será reemplazado |
| `start_date` | ✅ | string | - | Fecha/hora inicio (ISO 8601: `YYYY-MM-DDTHH:MM:SS`) |
| `end_date` | ❌ | string | - | Fecha/hora fin (ISO 8601). NULL = indefinido |
| `reason` | ❌ | string | 500 | Motivo del reemplazo |

**Response 201 Created:**
```json
{
  "data": {
    "id": 1,
    "colegio_id": 1,
    "vocal_parent_id": 3,
    "vocal_name": "Carlos",
    "vocal_surname": "López",
    "replaced_role": "tesorero",
    "replaced_parent_id": 2,
    "replaced_name": "María",
    "replaced_surname": "Gómez",
    "effective_role": "tesorero",
    "start_date": "2025-09-07T10:00:00Z",
    "end_date": "2025-09-14T18:00:00Z",
    "reason": "Tesorera con licencia médica por una semana",
    "is_active": 1,
    "created_by_name": "Juan",
    "created_by_surname": "Pérez",
    "created_at": "2025-09-07T09:00:00Z",
    "updated_at": "2025-09-07T09:00:00Z"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | El padre indicado no es vocal activo en este colegio |
| 404 | `NOT_FOUND` | No se encontró un directivo activo con rol X para reemplazar |
| 409 | `CONFLICT` | El vocal no puede reemplazarse a sí mismo |
| 409 | `CONFLICT` | Ya existe un reemplazo activo para el rol X |
| 409 | `CONFLICT` | Este vocal ya tiene un reemplazo activo |
| 409 | `CONFLICT` | La fecha de fin debe ser posterior a la fecha de inicio |

---

## PUT `/directiva/reemplazos/:id`

Actualizar un reemplazo (extender fecha, cambiar motivo, desactivar). Solo presidente o admin_colegio.

**Request:**
```
PUT /api/v1/directiva/reemplazos/1 HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "end_date": "2025-09-21T18:00:00",
  "reason": "Extensión por recuperación de la tesorera"
}
```

**Body Fields (todos opcionales):**

| Field | Type | Description |
|-------|------|-------------|
| `end_date` | string | Nueva fecha de fin (ISO 8601) |
| `reason` | string | Motivo actualizado |
| `is_active` | boolean | `false` para desactivar manualmente |

**Response 200 OK:**
```json
{
  "data": {
    "id": 1,
    "colegio_id": 1,
    "vocal_parent_id": 3,
    "vocal_name": "Carlos",
    "vocal_surname": "López",
    "replaced_role": "tesorero",
    "replaced_parent_id": 2,
    "replaced_name": "María",
    "replaced_surname": "Gómez",
    "effective_role": "tesorero",
    "start_date": "2025-09-07T10:00:00Z",
    "end_date": "2025-09-21T18:00:00Z",
    "reason": "Extensión por recuperación de la tesorera",
    "is_active": 1,
    "created_by_name": "Juan",
    "created_by_surname": "Pérez",
    "created_at": "2025-09-07T09:00:00Z",
    "updated_at": "2025-09-14T12:00:00Z"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Reemplazo no encontrado |
| 409 | `CONFLICT` | El reemplazo ya está inactivo |
| 409 | `CONFLICT` | La fecha de fin debe ser posterior a la fecha de inicio |

---

## DELETE `/directiva/reemplazos/:id`

Finalizar un reemplazo (el vocal vuelve a solo lectura). Solo presidente o admin_colegio.

**Request:**
```
DELETE /api/v1/directiva/reemplazos/1 HTTP/1.1
Authorization: Bearer <jwt>
```

**Response 200 OK:**
```json
{
  "data": {
    "message": "Reemplazo finalizado exitosamente"
  }
}
```

**Error Response:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `NOT_FOUND` | Reemplazo no encontrado |

---

## Comportamiento del Vocal con Reemplazo Activo

Cuando un vocal tiene un reemplazo activo, el sistema automáticamente cambia sus permisos:

| Estado del Vocal | Permisos |
|------------------|----------|
| Sin reemplazo | Solo lectura (role = `vocal`) |
| Con reemplazo activo | Permisos del rol reemplazado (ej: `tesorero`) |

**Ejemplo de flujo:**

```
1. Carlos (vocal) tiene permisos de solo lectura

2. Presidente crea reemplazo:
   POST /api/v1/directiva/reemplazos
   { vocal_parent_id: 3, replaced_role: 'tesorero', ... }

3. Carlos ahora puede acceder a endpoints de tesorero:
   ✅ GET /api/v1/finanzas/transacciones
   ✅ POST /api/v1/finanzas/gastos
   ❌ DELETE /api/v1/directiva/1 (solo presidente puede eliminar)

4. Presidente finaliza reemplazo:
   DELETE /api/v1/directiva/reemplazos/1

5. Carlos vuelve a solo lectura
```

---

## Reglas de Negocio

1. **Solo roles específicos pueden ser reemplazados:** `vicepresidente`, `tesorero`, `secretario`
   - Un vocal **NO** puede reemplazar a presidente (es el jefe de directiva)
   - Un vocal **NO** puede reemplazar a otro vocal (sería redundante)

2. **Un vocal solo puede tener un reemplazo activo a la vez**

3. **Un rol solo puede tener un reemplazo activo a la vez**

4. **El vocal no puede reemplazarse a sí mismo**

5. **Solo presidente o admin_colegio pueden autorizar/modificar/finalizar reemplazos**

6. **El effective_role se actualiza automáticamente en el JWT**
   - El cambio es inmediato (cache de 30 segundos máximo)
   - No es necesario hacer logout/login
