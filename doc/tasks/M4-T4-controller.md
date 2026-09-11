# M4 — T4: Controlador REST

**Módulo:** Asambleas
**Archivo a crear:** `src/modules/assemblies/assemblies.controller.ts`
**Referencia:** `src/modules/directiva/directiva.controller.ts` (patrón de controlador)

> **⚠️ NOTA:** El archivo `directiva.controller.ts` aún contiene `@Roles('admin_colegio', ...)` en su código actual. Este task describe el estado CORREGIDO sin `admin_colegio`. Usa el patrón de estructura de directiva.controller.ts pero con roles actualizados según `doc/a3-actores-permisos.md`.

---

## Contexto general

El controlador define los endpoints HTTP, recibe las peticiones, valida con DTOs y delega al servicio. Cada endpoint tiene decoradores de Swagger para documentación automática.

### Convenciones del proyecto

- **Guards:** `@UseGuards(JwtAuthGuard, RolesGuard)` en la CLASE (no en cada método)
- **Auth:** `@ApiBearerAuth()` en la CLASE
- **Tags:** `@ApiTags('ModuleName')` en la CLASE
- **Roles:** `@Roles(...)` en cada MÉTODO (no en la clase)
- **Colegio:** `@ColegioId()` en cada MÉTODO que necesite el colegio del JWT
- **Params numéricos:** `@Param('id', ParseIntPipe)` siempre
- **Status codes:** 200 para GET/PUT/DELETE, 201 para POST
- **Swagger:** `@ApiOperation` + `@ApiResponse` en cada endpoint

### Imports necesarios

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AssembliesService } from './assemblies.service';
import { CreateAssemblyDto } from './dto/create-assembly.dto';
import { UpdateAssemblyDto } from './dto/update-assembly.dto';
import { QueryAssemblyDto } from './dto/query-assembly.dto';
import { CreateAssemblyDetailDto } from './dto/create-assembly-detail.dto';
import { UpdateAssemblyDetailDto } from './dto/update-assembly-detail.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ColegioId } from '../../auth/decorators/colegio.decorator';
```

### Por qué cada import

- `Controller, Get, Post, Put, Delete` — Decoradores HTTP
- `Body, Param, Query` — Decoradores de parámetros
- `UseGuards` — Aplica guards de autenticación/autorización
- `ParseIntPipe` — Convierte string a number, lanza 400 si no es válido
- `HttpCode, HttpStatus` — Define status code personalizado
- `ApiTags, ApiOperation, ApiResponse, ApiBearerAuth` — Documentación Swagger
- `JwtAuthGuard` — Verifica que el JWT sea válido
- `RolesGuard` — Verifica que el usuario tenga el rol requerido
- `Roles` — Define qué roles pueden acceder al endpoint
- `ColegioId` — Extrae el `colegio_id` del JWT token

---

## T4.1 — Crear controlador de asambleas

Crear `src/modules/assemblies/assemblies.controller.ts` con los 8 endpoints REST del módulo.

### Estructura base del controlador

```typescript
@ApiTags('Assemblies')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('assemblies')
export class AssembliesController {
  constructor(private readonly assembliesService: AssembliesService) {}
}
```

### Endpoints de lectura (todos los autenticados)

#### GET `/assemblies` — Listar asambleas del colegio

```typescript
@Get()
@Roles(
  'presidente',
  'vicepresidente',
  'tesorero',
  'secretario',
  'vocal',
)
@ApiOperation({ summary: 'Listar asambleas del colegio' })
@ApiResponse({ status: 200, description: 'Lista de asambleas con paginación' })
@ApiResponse({ status: 401, description: 'Token inválido' })
@ApiResponse({ status: 403, description: 'Permisos insuficientes' })
findAll(
  @ColegioId() colegioId: number,
  @Query() query: QueryAssemblyDto,
) {
  return this.assembliesService.findAll(colegioId, query);
}
```

**Por qué 5 roles:** Todos los miembros de directiva pueden VER asambleas (lectura). Solo presidente puede CREAR/MODIFICAR.

#### GET `/assemblies/:id` — Detalle de asamblea

```typescript
@Get(':id')
@Roles(
  'presidente',
  'vicepresidente',
  'tesorero',
  'secretario',
  'vocal',
)
@ApiOperation({ summary: 'Obtener una asamblea por ID con sus detalles' })
@ApiResponse({ status: 200, description: 'Asamblea encontrada' })
@ApiResponse({ status: 404, description: 'Asamblea no encontrada' })
findOne(
  @Param('id', ParseIntPipe) id: number,
  @ColegioId() colegioId: number,
) {
  return this.assembliesService.findOne(id, colegioId);
}
```

**Por qué `ParseIntPipe`:** El parámetro de URL llega como string (`/assemblies/1` → `"1"`). `ParseIntPipe` lo convierte a number y lanza 400 si no es un número válido.

### Endpoints de escritura (solo presidente)

#### POST `/assemblies` — Crear asamblea

```typescript
@Post()
@Roles('presidente')
@HttpCode(HttpStatus.CREATED)
@ApiOperation({ summary: 'Crear una nueva asamblea' })
@ApiResponse({ status: 201, description: 'Asamblea creada exitosamente' })
@ApiResponse({ status: 401, description: 'Token inválido' })
@ApiResponse({ status: 403, description: 'Permisos insuficientes' })
create(
  @Body() dto: CreateAssemblyDto,
  @ColegioId() colegioId: number,
) {
  return this.assembliesService.create(dto, colegioId);
}
```

**Por qué `@HttpCode(HttpStatus.CREATED)`:** Por defecto NestJS retorna 200 para POST. El estándar REST es 201 para creación.

#### PUT `/assemblies/:id` — Editar asamblea

```typescript
@Put(':id')
@Roles('presidente')
@ApiOperation({ summary: 'Actualizar una asamblea existente' })
@ApiResponse({ status: 200, description: 'Asamblea actualizada' })
@ApiResponse({ status: 404, description: 'Asamblea no encontrada' })
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateAssemblyDto,
  @ColegioId() colegioId: number,
) {
  return this.assembliesService.update(id, dto, colegioId);
}
```

#### DELETE `/assemblies/:id` — Eliminar asamblea (soft delete)

```typescript
@Delete(':id')
@Roles('presidente')
@ApiOperation({ summary: 'Eliminar una asamblea (soft delete)' })
@ApiResponse({ status: 200, description: 'Asamblea eliminada' })
@ApiResponse({ status: 404, description: 'Asamblea no encontrada' })
remove(
  @Param('id', ParseIntPipe) id: number,
  @ColegioId() colegioId: number,
) {
  return this.assembliesService.remove(id, colegioId);
}
```

### Endpoints de detalles anidados

Los detalles son recursos anidados bajo una asamblea. La URL es `/assemblies/:id/details`.

#### POST `/assemblies/:id/details` — Crear detalle

```typescript
@Post(':id/details')
@Roles('presidente', 'secretario')
@HttpCode(HttpStatus.CREATED)
@ApiOperation({ summary: 'Crear un detalle en una asamblea' })
@ApiResponse({ status: 201, description: 'Detalle creado' })
@ApiResponse({ status: 404, description: 'Asamblea no encontrada' })
createDetail(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: CreateAssemblyDetailDto,
  @ColegioId() colegioId: number,
) {
  return this.assembliesService.createDetail(id, dto, colegioId);
}
```

#### PUT `/assemblies/:id/details/:detailId` — Editar detalle

```typescript
@Put(':id/details/:detailId')
@Roles('presidente', 'secretario')
@ApiOperation({ summary: 'Actualizar un detalle de asamblea' })
@ApiResponse({ status: 200, description: 'Detalle actualizado' })
@ApiResponse({ status: 404, description: 'Detalle no encontrado' })
updateDetail(
  @Param('id', ParseIntPipe) id: number,
  @Param('detailId', ParseIntPipe) detailId: number,
  @Body() dto: UpdateAssemblyDetailDto,
  @ColegioId() colegioId: number,
) {
  return this.assembliesService.updateDetail(id, detailId, dto, colegioId);
}
```

#### DELETE `/assemblies/:id/details/:detailId` — Eliminar detalle (soft delete)

```typescript
@Delete(':id/details/:detailId')
@Roles('presidente')
@ApiOperation({ summary: 'Eliminar un detalle de asamblea (soft delete)' })
@ApiResponse({ status: 200, description: 'Detalle eliminado' })
@ApiResponse({ status: 404, description: 'Detalle no encontrado' })
removeDetail(
  @Param('id', ParseIntPipe) id: number,
  @Param('detailId', ParseIntPipe) detailId: number,
  @ColegioId() colegioId: number,
) {
  return this.assembliesService.removeDetail(id, detailId, colegioId);
}
```

### Criterios de aceptación

- [ ] 8 endpoints implementados
- [ ] `@ApiTags`, `@ApiBearerAuth` en la clase
- [ ] `@ApiOperation` y `@ApiResponse` en cada endpoint
- [ ] `@Roles` correctos (lectura: 5 roles, escritura: 2 roles)
- [ ] `@ColegioId()` en todos los métodos
- [ ] `@ParseIntPipe` en todos los `@Param` numéricos
- [ ] Status codes: 201 para POST, 200 para PUT/DELETE
- [ ] GET `/assemblies/:id` retorna la asamblea con sus detalles anidados
- [ ] Patrón consistente con `directiva.controller.ts`

---

## Notas importantes

1. **Orden de decoradores:** El orden importa. En NestJS, los decoradores se evalúan de arriba a abajo. Siempre poner `@Roles()` antes de `@ApiOperation()`.

2. **`@ColegioId()` vs `@CurrentUser()`:**
   - `@ColegioId()` → extrae `colegio_id` del JWT (number | null para super_admin)
   - `@CurrentUser()` → extrae el objeto usuario completo del JWT
   - Usar `@ColegioId()` cuando solo necesitas el ID del colegio

3. **No enviar `colegio_id` en body:** El `colegio_id` viene del JWT, no del body. Si el frontend lo envía, se ignora.

4. **Super admin:** Cuando `colegioId` es `null` (super_admin), el servicio puede omitir el filtro de colegio y mostrar datos de todos los colegios.

5. **Swagger:** Cada endpoint DEBE tener `@ApiOperation` y al menos un `@ApiResponse`. Esto genera la documentación automática en `/api/docs`.
