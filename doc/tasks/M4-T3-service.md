# M4 — T3: Servicio de Lógica de Negocio

**Módulo:** Asambleas
**Archivos a crear:** `src/modules/assemblies/assemblies.service.ts`
**Documentos a revisar:** `src/modules/directiva/directiva.service.ts` (patrón de servicio existente), `doc/a4-caso-uso.md` (casos de uso de asambleas)

---

## T3.1 — Crear servicio de asambleas

Crear el archivo `src/modules/assemblies/assemblies.service.ts` con la lógica de negocio para asambleas y sus detalles.

El servicio debe inyectar el repositorio de TypeORM para las entidades `Assembly` y `AssemblyDetail`. Usar `@InjectRepository()` para ambas entidades.

### Métodos para asamblea (CRUD principal)

Implementar los siguientes métodos:

1. **findAll** — Retorna una lista paginada de asambleas del colegio. Debe:
   - Filtrar siempre por `colegio_id`
   - Aplicar soft delete (excluir registros con `deleted_at` no nulo)
   - Soportar paginación (page, limit)
   - Si se envía parámetro `search`, buscar por título (LIKE)
   - Si se envían `date_from` o `date_to`, filtrar por rango de fechas
   - Retornar objeto con `data` (array de asambleas) y `meta` (total, page, limit, total_pages)

2. **findOne** — Retorna una asamblea por ID dentro del colegio. Debe:
   - Filtrar por `colegio_id` y `id`
   - Incluir los detalles de la asamblea (relación con `AssemblyDetail`)
   - Lanzar `NotFoundException` si no existe

3. **create** — Crea una nueva asamblea. Debe:
   - Recibir el `colegio_id` y el DTO con los datos
   - Crear el registro con los campos del DTO
   - Retornar la asamblea creada

4. **update** — Actualiza una asamblea existente. Debe:
   - Verificar que la asamblea existe en el colegio
   - Actualizar solo los campos enviados en el DTO
   - Retornar la asamblea actualizada
   - Lanzar `NotFoundException` si no existe

5. **remove** — Elimina lógicamente una asamblea. Debe:
   - Verificar que la asamblea existe en el colegio
   - Establecer `deleted_at` con la fecha/hora actual
   - No eliminar físicamente el registro
   - Lanzar `NotFoundException` si no existe

### Métodos para detalles de asamblea (CRUD anidado)

Implementar los siguientes métodos:

1. **findDetails** — Retorna todos los detalles de una asamblea específica. Debe:
   - Filtrar por `assembly_id` y `colegio_id`
   - Excluir registros eliminados lógicamente

2. **findDetailById** — Retorna un detalle específico por ID. Debe:
   - Filtrar por `assembly_id`, `detailId` y `colegio_id`
   - Lanzar `NotFoundException` si no existe

3. **createDetail** — Crea un nuevo detalle para una asamblea. Debe:
   - Verificar que la asamblea existe y pertenece al colegio
   - Crear el detalle con los datos del DTO
   - Retornar el detalle creado

4. **updateDetail** — Actualiza un detalle existente. Debe:
   - Verificar que el detalle existe y pertenece a la asamblea y colegio
   - Actualizar solo los campos enviados
   - Retornar el detalle actualizado

5. **removeDetail** — Elimina lógicamente un detalle. Debe:
   - Verificar que el detalle existe
   - Establecer `deleted_at` con la fecha/hora actual
   - Lanzar `NotFoundException` si no existe

### Reglas de negocio importantes

- TODAS las queries deben filtrar por `colegio_id` — nunca acceder datos de otro colegio
- El soft delete se aplica en ambas tablas (asamblea y detalle_asamblea)
- Antes de crear/editar un detalle, verificar que la asamblea padre existe
- Los mensajes de error deben ser en español
- Usar `NotFoundException` de @nestjs/common para errores 404

**Criterios de aceptación:**

- [ ] Archivo `assemblies.service.ts` creado
- [ ] Todos los métodos implementados (5 para asamblea + 5 para detalles)
- [ ] Aislamiento multi-tenant en todas las queries
- [ ] Soft delete implementado correctamente
- [ ] Mensajes de error en español
- [ ] Excepciones `NotFoundException` lanzadas cuando corresponde
