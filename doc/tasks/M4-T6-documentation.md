# M4 — T6: Documentación

**Módulo:** Asambleas
**Archivos a modificar:** `doc/api-reference.md`, `doc/a8/a8-4-assemblies.md`
**Documentos a revisar:** `doc/api-reference.md` (formato existente), `doc/a8/a8-6-reemplazos.md` (formato de documentación frontend), `doc/a5/a5-4-assemblies.md` (definición de endpoints)

---

## Contexto general

La documentación tiene dos partes:

1. **api-reference.md** — Referencia técnica completa para el equipo de backend. Incluye todos los endpoints con request/response examples, errores, y códigos de error.

2. **a8-4-assemblies.md** — Guía para el equipo de frontend. Más práctica, con ejemplos copiables, flujos de uso, y notas de implementación.

### Convenciones de documentación

- **Idioma:** Español para descripciones, inglés para código/JSON
- **Formato JSON:** Siempre formateado y realista (no `{ "id": 1 }` sino datos que parezcan reales)
- **Errores:** Tabla con status code, código de error interno, y mensaje para el usuario
- **Ejemplos:** Copy-pasteables, sin placeholders como `:id` o `{{token}}`
- **Paths relativos:** Referenciar archivos con paths relativos desde `doc/`

---

## T6.1 — Actualizar api-reference.md

Modificar el archivo `doc/api-reference.md` para agregar la sección de Asambleas.

### Pasos a seguir

1. Abrir `doc/api-reference.md` y ubicar la sección 7 (Common Patterns) o la última sección existente
2. Insertar una nueva sección antes de Common Patterns con el título "8. Asambleas"
3. Documentar los 8 endpoints del módulo

### Formato para cada endpoint

```markdown
### 8.X — [MÉTODO] `/ruta`

[Descripción breve del endpoint]

**Autenticación:** Bearer token requerido
**Roles permitidos:** `presidente`, `secretario`, etc.

#### Path Parameters

| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | number | ID de la asamblea |

#### Query Parameters

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `page` | number | 1 | Número de página |
| `limit` | number | 10 | Elementos por página |

#### Body

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `title` | string | sí | Nombre de la asamblea |

#### Request Example

```bash
curl -X POST http://localhost:3000/api/v1/assemblies \
  -H "Authorization: Bearer eyJhbGci..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Asamblea Ordinaria 2025",
    "date": "2025-06-15",
    "description": "Presupuesto trimestral"
  }'
```

#### Response (201)

```json
{
  "id": 1,
  "colegio_id": 1,
  "title": "Asamblea Ordinaria 2025",
  "date": "2025-06-15",
  "description": "Presupuesto trimestral",
  "created_at": "2025-06-10T14:30:00.000Z",
  "updated_at": null,
  "deleted_at": null
}
```

#### Errores

| Status | Código | Mensaje |
|--------|--------|---------|
| 400 | `VALIDATION_ERROR` | "title should not be empty" |
| 401 | `UNAUTHORIZED` | "Token inválido" |
| 403 | `FORBIDDEN` | "Permisos insuficientes" |
```

### Endpoints a documentar

1. **GET `/assemblies`** — Listar asambleas (paginación, filtros)
2. **GET `/assemblies/:id`** — Detalle de asamblea (con detalles anidados)
3. **POST `/assemblies`** — Crear asamblea (body: title, date, description)
4. **PUT `/assemblies/:id`** — Editar asamblea (body parcial)
5. **DELETE `/assemblies/:id`** — Eliminar asamblea
6. **POST `/assemblies/:id/details`** — Crear detalle (body: description, registration_date, image_url)
7. **PUT `/assemblies/:id/details/:detailId`** — Editar detalle
8. **DELETE `/assemblies/:id/details/:detailId`** — Eliminar detalle

### Ejemplo de response paginado (GET /assemblies)

```json
{
  "data": [
    {
      "id": 1,
      "colegio_id": 1,
      "title": "Asamblea Ordinaria 2025",
      "date": "2025-06-15",
      "description": "Presupuesto trimestral",
      "created_at": "2025-06-10T14:30:00.000Z",
      "updated_at": null,
      "deleted_at": null
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

**NOTA:** El formato de paginación es `{ data: [], pagination: { page, limit, total, total_pages } }`. NO usar `{ results: [], meta: {} }`.

### Actualizar Table of Contents

Agregar al inicio del archivo, en la tabla de contenidos, la referencia a la sección 8 de Asambleas.

### Criterios de aceptación

- [ ] Sección 8 de Asambleas agregada a api-reference.md
- [ ] 8 endpoints documentados con request/response examples
- [ ] Errores documentados para cada endpoint
- [ ] Table of Contents actualizado
- [ ] Formato consistente con secciones anteriores

---

## T6.2 — Crear documentación detallada para frontend

Verificar y actualizar el archivo `doc/a8/a8-4-assemblies.md` con documentación completa para el equipo de frontend.

### Estructura del documento

El documento debe seguir el mismo formato que `doc/a8/a8-6-reemplazos.md` y contener:

#### 1. Título

```markdown
# A8 — Asambleas

**¿Cómo consultar y gestionar asambleas del colegio?**
```

#### 2. Tabla de endpoints

```markdown
## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/assemblies` | Listar asambleas del colegio |
| GET | `/assemblies/:id` | Detalle de asamblea con detalles |
| POST | `/assemblies` | Crear asamblea |
| PUT | `/assemblies/:id` | Editar asamblea |
| DELETE | `/assemblies/:id` | Eliminar asamblea |
| POST | `/assemblies/:id/details` | Crear detalle |
| PUT | `/assemblies/:id/details/:detailId` | Editar detalle |
| DELETE | `/assemblies/:id/details/:detailId` | Eliminar detalle |
```

#### 3. Detalle de cada endpoint

Para cada endpoint incluir:

```markdown
## GET `/assemblies`

Lista las asambleas del colegio con paginación y filtros.

**Headers requeridos:**
- `Authorization: Bearer <token>`

**Query Parameters:**

| Param | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| `page` | number | no | 1 | Página actual |
| `limit` | number | no | 10 | Elementos por página (máx 100) |
| `search` | string | no | — | Buscar por título |
| `date_from` | string | no | — | Fecha desde (YYYY-MM-DD) |
| `date_to` | string | no | — | Fecha hasta (YYYY-MM-DD) |

**Request:**

```bash
curl -X GET "http://localhost:3000/api/v1/assemblies?page=1&limit=10&search=presupuesto" \
  -H "Authorization: Bearer eyJhbGci..."
```

**Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "colegio_id": 1,
      "title": "Asamblea Ordinaria 2025",
      "date": "2025-06-15",
      "description": "Se discutió el presupuesto",
      "created_at": "2025-06-10T14:30:00.000Z",
      "updated_at": null,
      "deleted_at": null
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

**Errores:**

| Status | Mensaje |
|--------|---------|
| 401 | Token inválido |
| 403 | Permisos insuficientes |
```

#### 4. Casos de uso comunes

```markdown
## Casos de uso

### Crear asamblea y agregar detalles

1. Crear asamblea con POST `/assemblies`
2. Copiar el `id` de la respuesta
3. Crear detalles con POST `/assemblies/:id/details`
4. Repetir paso 3 para cada detalle

### Listar asambleas con filtros

1. GET `/assemblies?date_from=2025-01-01&date_to=2025-12-31`
2. Usar `pagination.total_pages` para navegar páginas

### Editar un detalle existente

1. GET `/assemblies/:id` para obtener la asamblea
2. Identificar el `detailId` del detalle a editar
3. PUT `/assemblies/:id/details/:detailId` con los campos actualizados
```

#### 5. Notas para frontend

```markdown
## Notas para frontend

- Todos los endpoints requieren JWT token en header `Authorization`
- El `colegio_id` se extrae del token automáticamente (no enviar en body)
- Las fechas usan formato ISO 8601: `YYYY-MM-DD`
- Soft delete: los registros eliminados no aparecen en listados
- La paginación usa `{ data: [], pagination: { page, limit, total, total_pages } }`
- Para super admin: el endpoint retorna datos de todos los colegios
```

### Criterios de aceptación

- [ ] Archivo `a8-4-assemblies.md` creado en `doc/a8/`
- [ ] 8 endpoints documentados con examples completos
- [ ] Request examples copy-pasteables
- [ ] Response examples con JSON realista
- [ ] Tablas de errores para cada endpoint
- [ ] Casos de uso incluidos
- [ ] Notas para frontend incluidas

---

## Notas importantes

1. **Consistencia de formato:** Seguir EXACTAMENTE el formato de `a8-6-reemplazos.md`. Si hay diferencias, el frontend se confundirá.

2. **JSON realista:** No usar `{ "id": 1 }`. Usar datos que parezcan reales: `{ "id": 1, "title": "Asamblea Ordinaria 2025", "date": "2025-06-15" }`.

3. **Errores completos:** Documentar TODOS los errores posibles, no solo los comunes. El frontend necesita saber qué hacer en cada caso.

4. **Paths correctos:** Todos los endpoints usan prefijo `/api/v1/`. Ejemplo: `http://localhost:3000/api/v1/assemblies`.

5. **Token real:** En examples, usar un token JWT que parezca real (aunque sea fake). No usar `{{token}}` o `YOUR_TOKEN_HERE`.

6. **Coherencia con código:** Los nombres de campos en la documentación DEBEN coincidir exactamente con los DTOs. Si el DTO dice `registration_date`, no documentar `registrationDate`.
