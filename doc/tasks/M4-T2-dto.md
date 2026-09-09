# M4 — T2: DTOs y Validaciones

**Módulo:** Asambleas
**Archivos a crear:** `src/modules/assemblies/dto/`
**Documentos a revisar:** `doc/a7/a7-3-board.md` (patrones de DTOs existentes), `doc/a2-entidades-atributos.md` (campos de las entidades)

---

## T2.1 — Crear DTOs de asamblea

Crear una carpeta `src/modules/assemblies/dto/` y dentro de ella tres archivos para los DTOs de asamblea.

### CreateAssemblyDto

Crear el archivo `create-assembly.dto.ts` con los siguientes campos:

- `title` — Texto obligatorio, máximo 255 caracteres. Mensaje de error: "El título es obligatorio"
- `date` — Fecha en formato ISO (YYYY-MM-DD), obligatoria. Mensaje de error: "La fecha es obligatoria"
- `description` — Texto largo, opcional. Sin límite de caracteres

Todos los campos deben usar decoradores de validación de class-validator. El DTO debe exportarse como clase.

### UpdateAssemblyDto

Crear el archivo `update-assembly.dto.ts` con los mismos campos que CreateAssemblyDto, pero todos opcionales (parcial type). Esto permite actualizar solo los campos enviados.

### QueryAssemblyDto

Crear el archivo `query-assembly.dto.ts` para filtros de búsqueda. Debe extender un DTO de paginación existente (verificar en el proyecto si existe `PaginationDto` o similar) y agregar:

- `search` — Texto opcional para buscar por título
- `date_from` — Fecha opcional para filtrar desde
- `date_to` — Fecha opcional para filtrar hasta

**Criterios de aceptación:**

- [ ] Carpeta `src/modules/assemblies/dto/` creada
- [ ] Archivo `create-assembly.dto.ts` creado con campos y validaciones
- [ ] Archivo `update-assembly.dto.ts` creado con campos opcionales
- [ ] Archivo `query-assembly.dto.ts` creado con filtros
- [ ] Todos los mensajes de error en español
- [ ] Clases exportadas correctamente

---

## T2.2 — Crear DTOs de detalle de asamblea

Dentro de la misma carpeta `src/modules/assemblies/dto/`, crear dos archivos para los DTOs de detalle.

### CreateAssemblyDetailDto

Crear el archivo `create-assembly-detail.dto.ts` con los siguientes campos:

- `description` — Texto largo obligatorio. Mensaje de error: "La descripción es obligatoria"
- `registration_date` — Fecha en formato ISO (YYYY-MM-DD), obligatoria. Mensaje de error: "La fecha de registro es obligatoria"
- `image_url` — Texto opcional, máximo 500 caracteres para URL de imagen

### UpdateAssemblyDetailDto

Crear el archivo `update-assembly-detail.dto.ts` con los mismos campos, pero todos opcionales.

**Criterios de aceptación:**

- [ ] Archivo `create-assembly-detail.dto.ts` creado con campos y validaciones
- [ ] Archivo `update-assembly-detail.dto.ts` creado con campos opcionales
- [ ] Mensajes de error en español
- [ ] Clases exportadas correctamente
