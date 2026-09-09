# M4 — T6: Documentación

**Módulo:** Asambleas
**Archivos a modificar:** `doc/api-reference.md`
**Archivos a crear:** `doc/a8/a8-4-assemblies.md`
**Documentos a revisar:** `doc/api-reference.md` (formato existente), `doc/a8/a8-6-reemplazos.md` (formato de documentación frontend), `doc/a5/a5-4-assemblies.md` (definición de endpoints)

---

## T6.1 — Actualizar api-reference.md

Modificar el archivo `doc/api-reference.md` para agregar la sección de Asambleas.

### Pasos a seguir

1. Abrir `doc/api-reference.md` y ubicar la sección 7 (Common Patterns)
2. Insertar una nueva sección 8 antes de Common Patterns con el título "8. Asambleas"
3. Documentar los 8 endpoints del módulo con el siguiente formato para cada uno:

Para cada endpoint incluir:

- Método HTTP y ruta
- Descripción breve
- Headers requeridos (Authorization: Bearer token)
- Parameters (path params, query params, body)
- Ejemplo de request completo
- Ejemplo de response JSON
- Tabla de errores posibles con status code, código de error y mensaje

### Endpoints a documentar

1. **GET `/assemblies`** — Listar asambleas (paginación, filtros)
2. **GET `/assemblies/:id`** — Detalle de asamblea (con detalles anidados)
3. **POST `/assemblies`** — Crear asamblea (body: title, date, description)
4. **PUT `/assemblies/:id`** — Editar asamblea (body parcial)
5. **DELETE `/assemblies/:id`** — Eliminar asamblea
6. **POST `/assemblies/:id/details`** — Crear detalle (body: description, registration_date, image_url)
7. **PUT `/assemblies/:id/details/:detailId`** — Editar detalle
8. **DELETE `/assemblies/:id/details/:detailId`** — Eliminar detalle

### Actualizar Table of Contents

Agregar al inicio del archivo, en la tabla de contenidos, la referencia a la sección 8 de Asambleas.

**Criterios de aceptación:**

- [ ] Sección 8 de Asambleas agregada a api-reference.md
- [ ] 8 endpoints documentados con request/response examples
- [ ] Errores documentados para cada endpoint
- [ ] Table of Contents actualizado

---

## T6.2 — Crear documentación detallada para frontend

Crear el archivo `doc/a8/a8-4-assemblies.md` con documentación completa para el equipo de frontend.

### Estructura del documento

El documento debe seguir el mismo formato que `doc/a8/a8-6-reemplazos.md` y contener:

1. **Título** — "A8 — Asambleas" con una pregunta guía como subtítulo
2. **Tabla de endpoints** — Resumen de los 8 endpoints con método, ruta y descripción
3. **Detalle de cada endpoint** — Para cada endpoint incluir:
   - Método y ruta
   - Descripción
   - Headers requeridos
   - Path parameters (si aplica)
   - Query parameters (si aplica)
   - Body fields con tipo y descripción
   - Ejemplo de request completo (copy-pasteable)
   - Ejemplo de response JSON completo
   - Tabla de errores posibles
4. **Casos de uso comunes** — Ejemplos de flujo típico:
   - Crear asamblea y agregar detalles
   - Listar asambleas con filtros
   - Editar un detalle existente
5. **Notas para frontend** — Consideraciones especiales:
   - Todos los endpoints requieren JWT
   - El `colegio_id` se extrae del token (no enviar en body)
   - Las fechas usan formato ISO 8601
   - Soft delete: los registros eliminados no aparecen en listados

### Contenido específico

El documento debe incluir request/response examples completos y copiables para cada endpoint, con JSON formateado y realista.

**Criterios de aceptación:**

- [ ] Archivo `a8-4-assemblies.md` creado en `doc/a8/`
- [ ] 8 endpoints documentados con examples completos
- [ ] Request examples copy-pasteables
- [ ] Response examples con JSON realista
- [ ] Tablas de errores para cada endpoint
- [ ] Casos de uso incluidos
- [ ] Notas para frontend incluidas
