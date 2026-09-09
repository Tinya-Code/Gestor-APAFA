# M4 — T4: Controlador REST

**Módulo:** Asambleas
**Archivos a crear:** `src/modules/assemblies/assemblies.controller.ts`
**Documentos a revisar:** `src/modules/directiva/directiva.controller.ts` (patrón de controlador), `src/auth/guards/roles.guard.ts` (cómo funcionan los roles), `doc/a5/a5-4-assemblies.md` (endpoints definidos)

---

## T4.1 — Crear controlador de asambleas

Crear el archivo `src/modules/assemblies/assemblies.controller.ts` con los 8 endpoints REST para el módulo de asambleas.

### Configuración del controlador

El controlador debe:

- Usar el decorador `@Controller('assemblies')` para definir la ruta base
- Usar `@UseGuards(AuthGuard, RolesGuard)` para proteger todos los endpoints
- Inyectar `AssembliesService` en el constructor
- Importar los decoradores necesarios: `@Get`, `@Post`, `@Put`, `@Delete`, `@Param`, `@Body`, `@Query`, `@Roles`, `@ColegioId`

### Endpoints a implementar

**1. GET `/assemblies`** — Listar asambleas del colegio

- Sin restricción de roles (todos los autenticados pueden ver)
- Acepta query parameters de paginación y filtros
- Retorna lista paginada de asambleas

**2. GET `/assemblies/:id`** — Detalle de una asamblea

- Sin restricción de roles (todos los autenticados pueden ver)
- Acepta parámetro `id` en la URL
- Retorna asamblea con sus detalles anidados

**3. POST `/assemblies`** — Crear una asamblea

- Restringido a roles: `presidente` y `admin_colegio`
- Acepta body con datos de la asamblea (usar CreateAssemblyDto)
- Retorna asamblea creada con status 201

**4. PUT `/assemblies/:id`** — Editar una asamblea

- Restringido a roles: `presidente` y `admin_colegio`
- Acepta parámetro `id` y body con datos a actualizar (usar UpdateAssemblyDto)
- Retorna asamblea actualizada

**5. DELETE `/assemblies/:id`** — Eliminar una asamblea

- Restringido a roles: `presidente` y `admin_colegio`
- Acepta parámetro `id`
- Retorna mensaje de confirmación con status 200

**6. POST `/assemblies/:id/details`** — Crear un detalle de asamblea

- Restringido a roles: `presidente` y `admin_colegio`
- Acepta parámetro `id` (ID de la asamblea padre) y body con datos del detalle (usar CreateAssemblyDetailDto)
- Retorna detalle creado con status 201

**7. PUT `/assemblies/:id/details/:detailId`** — Editar un detalle

- Restringido a roles: `presidente` y `admin_colegio`
- Acepta parámetros `id` y `detailId`, y body con datos a actualizar (usar UpdateAssemblyDetailDto)
- Retorna detalle actualizado

**8. DELETE `/assemblies/:id/details/:detailId`** — Eliminar un detalle

- Restringido a roles: `presidente` y `admin_colegio`
- Acepta parámetros `id` y `detailId`
- Retorna mensaje de confirmación

### Decoradores de roles

Los endpoints de lectura (GET) no necesitan restricción de roles — cualquier usuario autenticado puede acceder.

Los endpoints de escritura (POST, PUT, DELETE) deben usar:
```
@Roles('presidente', 'admin_colegio')
```

Esto asegura que solo el presidente o el admin del colegio puedan crear, editar o eliminar asambleas y sus detalles.

### Extracción del colegio

Todos los métodos deben recibir el `colegio_id` del JWT usando el decorador `@ColegioId()`. Este decorator extrae el `colegio_id` del token y lo pasa como parámetro al servicio.

**Criterios de aceptación:**

- [ ] Archivo `assemblies.controller.ts` creado
- [ ] 8 endpoints implementados correctamente
- [ ] Roles correctos en cada endpoint (lectura: todos, escritura: presidente/admin)
- [ ] Decorador `@ColegioId()` usado en todos los métodos
- [ ] Manejo de errores HTTP correcto (404 para no encontrado, 403 para no autorizado)
- [ ] Los endpoints de escritura retornan status 201 (POST) o 200 (PUT/DELETE)
