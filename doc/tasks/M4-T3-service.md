# M4 — T3: Servicio de Lógica de Negocio

**Módulo:** Asambleas
**Archivos a crear:**
- `src/shared/types/asamblea.types.ts`
- `src/modules/assemblies/assemblies.service.ts`

**Referencia:** `src/modules/directiva/directiva.service.ts` (patrón de servicio)

---

## Contexto general

El servicio contiene la lógica de negocio y accede a la base de datos. Este proyecto NO usa TypeORM — usa `DatabaseService` con queries SQL directas sobre `mysql2`.

### Convenciones del proyecto

- **Inyección de dependencias:** `constructor(private readonly db: DatabaseService) {}`
- **Queries de lectura:** `db.query<T[]>(sql, params)` — retorna array de filas
- **Queries de escritura:** `db.execute<ResultSetHeader>(sql, params)` — retorna metadatos de inserción/actualización
- **Tipos de params:** `(string | number | boolean)[]` — arrays con tipos mixtos
- **Paginación:** Usar `executePaginatedQuery` del helper compartido
- **Multi-tenant:** TODAS las queries filtran por `colegio_id`
- **Soft delete:** Nunca DELETE físico, siempre `deleted_at = NOW()`
- **Errores:** `NotFoundException` para 404, `ConflictException` para 409
- **Logger:** `private readonly logger = new Logger(ServiceName.name);`
- **Mensajes de error:** En español, descriptivos

### Imports necesarios para el servicio

```typescript
import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateAssemblyDto } from './dto/create-assembly.dto';
import { UpdateAssemblyDto } from './dto/update-assembly.dto';
import { QueryAssemblyDto } from './dto/query-assembly.dto';
import {
  executePaginatedQuery,
  type PaginatedResult,
} from '../../shared/helpers/pagination.helper';
import type { ResultSetHeader } from 'mysql2';
import type { AsambleaRow, DetalleAsambleaRow } from '../../shared/types/asamblea.types';
```

---

## T3.1 — Crear tipos compartidos de asamblea

Crear `src/shared/types/asamblea.types.ts` con los interfaces para las tablas `asamblea` y `detalle_asamblea`.

### Por qué dos tipos por tabla

- **`XxxRow`:** Extiende `RowDataPacket` de mysql2. Se usa en queries SELECT porque mysql2 retorna filas con esta forma.
- **`XxxEntity`:** Misma estructura pero SIN extender `RowDataPacket`. Se usa para respuestas HTTP y lógica de negocio donde no necesitamos el tipo de mysql2.

### Ejemplo completo

```typescript
import type { RowDataPacket } from 'mysql2';

/**
 * Row type for asamblea table queries.
 * Used by AssembliesService for DB operations.
 */
export interface AsambleaRow extends RowDataPacket {
  id: number;
  colegio_id: number;
  title: string;
  date: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

/**
 * Entity type for asamblea responses.
 * Matches AsambleaRow but without RowDataPacket extension.
 */
export interface AsambleaEntity {
  id: number;
  colegio_id: number;
  title: string;
  date: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

/**
 * Row type for detalle_asamblea table queries.
 */
export interface DetalleAsambleaRow extends RowDataPacket {
  id: number;
  colegio_id: number;
  assembly_id: number;
  description: string;
  registration_date: string;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

/**
 * Entity type for detalle_asamblea responses.
 */
export interface DetalleAsambleaEntity {
  id: number;
  colegio_id: number;
  assembly_id: number;
  description: string;
  registration_date: string;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
```

### Criterios de aceptación

- [ ] Archivo `asamblea.types.ts` creado
- [ ] Interfaces Row y Entity para ambas tablas
- [ ] Tipos consistentes con `DirectivaRow` y `DirectivaEntity`

---

## T3.2 — Crear servicio de asambleas

Crear `src/modules/assemblies/assemblies.service.ts`.

### Estructura base del servicio

```typescript
import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateAssemblyDto } from './dto/create-assembly.dto';
import { UpdateAssemblyDto } from './dto/update-assembly.dto';
import { QueryAssemblyDto } from './dto/query-assembly.dto';
import {
  executePaginatedQuery,
  type PaginatedResult,
} from '../../shared/helpers/pagination.helper';
import type { ResultSetHeader } from 'mysql2';
import type { AsambleaRow, DetalleAsambleaRow } from '../../shared/types/asamblea.types';

@Injectable()
export class AssembliesService {
  private readonly logger = new Logger(AssembliesService.name);

  constructor(private readonly db: DatabaseService) {}

  // ... métodos aquí
}
```

### Métodos para asamblea (CRUD principal)

#### 1. findAll(colegioId, query) — Lista paginada

```typescript
async findAll(
  colegioId: number | null,
  query: QueryAssemblyDto,
): Promise<PaginatedResult<AsambleaRow>> {
  const hasColegioFilter = colegioId != null;
  const conditions: string[] = hasColegioFilter
    ? ['a.colegio_id = ?', 'a.deleted_at IS NULL']
    : ['a.deleted_at IS NULL'];
  const params: (string | number)[] = hasColegioFilter ? [colegioId] : [];

  // Filtro por búsqueda en título
  if (query.search) {
    conditions.push('a.title LIKE ?');
    params.push(`%${query.search}%`);
  }

  // Filtro por fecha desde
  if (query.date_from) {
    conditions.push('a.date >= ?');
    params.push(query.date_from);
  }

  // Filtro por fecha hasta
  if (query.date_to) {
    conditions.push('a.date <= ?');
    params.push(query.date_to);
  }

  const where = conditions.join(' AND ');

  const dataQuery = `
    SELECT a.*
    FROM asamblea a
    WHERE ${where}
    ORDER BY a.date DESC, a.created_at DESC
  `;

  const countQuery = `
    SELECT COUNT(*) as total
    FROM asamblea a
    WHERE ${where}
  `;

  return executePaginatedQuery<AsambleaRow>(
    this.db,
    dataQuery,
    params,
    countQuery,
    params,
    { page: query.page, limit: query.limit },
  );
}
```

**Por qué `executePaginatedQuery`:**
- Ejecuta data query y count query en paralelo (`Promise.all`)
- Calcula `total_pages` automáticamente
- Retorna `PaginatedResult<T>` con `{ data, pagination }`
- Acepta `(string | number | boolean)[]` como parámetros

#### 2. findOne(id, colegioId) — Asamblea por ID

```typescript
async findOne(id: number, colegioId: number | null): Promise<AsambleaRow> {
  const hasColegioFilter = colegioId != null;
  const conditions = ['a.id = ?', 'a.deleted_at IS NULL'];
  const params: (string | number)[] = [id];

  if (hasColegioFilter) {
    conditions.unshift('a.colegio_id = ?');
    params.unshift(colegioId);
  }

  const [asamblea] = await this.db.query<AsambleaRow[]>(
    `SELECT a.*
     FROM asamblea a
     WHERE ${conditions.join(' AND ')}`,
    params,
  );

  if (!asamblea) {
    throw new NotFoundException('Asamblea no encontrada');
  }

  return asamblea;
}
```

**Por qué `unshift`:** Agrega `colegio_id` al inicio del array de condiciones y parámetros para que el orden sea correcto en la query.

#### 2.1 findOneWithDetails(id, colegioId) — Asamblea con detalles

Método que retorna una asamblea con sus detalles anidados combinando `findOne` y `findDetails`. El endpoint GET `/assemblies/:id` usa este método para retornar la asamblea con sus detalles en una sola respuesta.

#### 3. create(dto, colegioId) — Crear asamblea

```typescript
async create(
  dto: CreateAssemblyDto,
  colegioId: number,
): Promise<AsambleaRow> {
  const [result] = await this.db.execute<ResultSetHeader>(
    `INSERT INTO asamblea (colegio_id, title, date, description)
     VALUES (?, ?, ?, ?)`,
    [colegioId, dto.title, dto.date, dto.description ?? null],
  );

  return this.findOne(result.insertId, colegioId);
}
```

**Por qué `execute` y no `query`:** `execute` retorna `ResultSetHeader` que incluye `insertId` (el ID generado automáticamente).

**Por qué `dto.description ?? null`:** Si `description` es `undefined` (campo opcional no enviado), lo convertimos a `null` para MySQL.

#### 4. update(id, dto, colegioId) — Actualizar asamblea

```typescript
async update(
  id: number,
  dto: UpdateAssemblyDto,
  colegioId: number,
): Promise<AsambleaRow> {
  await this.findOne(id, colegioId); // Verificar que existe

  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (dto.title !== undefined) {
    fields.push('title = ?');
    values.push(dto.title);
  }
  if (dto.date !== undefined) {
    fields.push('date = ?');
    values.push(dto.date);
  }
  if (dto.description !== undefined) {
    fields.push('description = ?');
    values.push(dto.description);
  }

  if (fields.length === 0) {
    return this.findOne(id, colegioId); // Nada que actualizar
  }

  values.push(id);

  await this.db.execute<ResultSetHeader>(
    `UPDATE asamblea SET ${fields.join(', ')} WHERE id = ?`,
    values,
  );

  return this.findOne(id, colegioId);
}
```

**Por qué query dinámica:** Solo actualizamos los campos enviados. Si el envía `{ title: "nuevo" }`, solo actualizamos `title`, no `date` ni `description`.

#### 5. remove(id, colegioId) — Soft delete

```typescript
async remove(id: number, colegioId: number): Promise<{ message: string }> {
  await this.findOne(id, colegioId); // Verificar que existe

  await this.db.execute<ResultSetHeader>(
    'UPDATE asamblea SET deleted_at = NOW() WHERE id = ?',
    [id],
  );

  return { message: 'Asamblea eliminada exitosamente' };
}
```

**Por qué soft delete:** El registro no se borra físicamente. Se marca `deleted_at` con la fecha/hora actual. Los queries de lectura filtran por `deleted_at IS NULL` para no mostrar registros eliminados.

### Métodos para detalles (CRUD anidado)

Los detalles son "hijos" de una asamblea. Siguen el mismo patrón pero con validación adicional: verificar que la asamblea padre existe.

#### 6. findDetails(assemblyId, colegioId) — Detalles de una asamblea

```typescript
async findDetails(
  assemblyId: number,
  colegioId: number,
): Promise<DetalleAsambleaRow[]> {
  // Verificar que la asamblea padre existe
  await this.findOne(assemblyId, colegioId);

  const detalles = await this.db.query<DetalleAsambleaRow[]>(
    `SELECT da.*
     FROM detalle_asamblea da
     WHERE da.assembly_id = ? AND da.colegio_id = ? AND da.deleted_at IS NULL
     ORDER BY da.registration_date DESC`,
    [assemblyId, colegioId],
  );

  return detalles;
}
```

**Por qué no paginado:** Los detalles de una asamblea suelen ser pocos (1-20 registros). No necesita paginación compleja.

#### 7. findDetailById(assemblyId, detailId, colegioId) — Detalle por ID

```typescript
async findDetailById(
  assemblyId: number,
  detailId: number,
  colegioId: number,
): Promise<DetalleAsambleaRow> {
  // Verificar que la asamblea padre existe
  await this.findOne(assemblyId, colegioId);

  const [detalle] = await this.db.query<DetalleAsambleaRow[]>(
    `SELECT da.*
     FROM detalle_asamblea da
     WHERE da.id = ? AND da.assembly_id = ? AND da.colegio_id = ? AND da.deleted_at IS NULL`,
    [detailId, assemblyId, colegioId],
  );

  if (!detalle) {
    throw new NotFoundException('Detalle de asamblea no encontrado');
  }

  return detalle;
}
```

**Por qué triple filtro:** Verificamos `id`, `assembly_id` Y `colegio_id` para garantizar multi-tenant. Un usuario no debería acceder a detalles de otro colegio.

#### 8. createDetail(assemblyId, dto, colegioId) — Crear detalle

```typescript
async createDetail(
  assemblyId: number,
  dto: CreateAssemblyDetailDto,
  colegioId: number,
): Promise<DetalleAsambleaRow> {
  // Verificar que la asamblea padre existe
  await this.findOne(assemblyId, colegioId);

  const [result] = await this.db.execute<ResultSetHeader>(
    `INSERT INTO detalle_asamblea (colegio_id, assembly_id, description, registration_date, image_url)
     VALUES (?, ?, ?, ?, ?)`,
    [colegioId, assemblyId, dto.description, dto.registration_date, dto.image_url ?? null],
  );

  return this.findDetailById(assemblyId, result.insertId, colegioId);
}
```

#### 9. updateDetail(assemblyId, detailId, dto, colegioId) — Actualizar detalle

```typescript
async updateDetail(
  assemblyId: number,
  detailId: number,
  dto: UpdateAssemblyDetailDto,
  colegioId: number,
): Promise<DetalleAsambleaRow> {
  await this.findDetailById(assemblyId, detailId, colegioId); // Verificar que existe

  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (dto.description !== undefined) {
    fields.push('description = ?');
    values.push(dto.description);
  }
  if (dto.registration_date !== undefined) {
    fields.push('registration_date = ?');
    values.push(dto.registration_date);
  }
  if (dto.image_url !== undefined) {
    fields.push('image_url = ?');
    values.push(dto.image_url);
  }

  if (fields.length === 0) {
    return this.findDetailById(assemblyId, detailId, colegioId);
  }

  values.push(detailId);

  await this.db.execute<ResultSetHeader>(
    `UPDATE detalle_asamblea SET ${fields.join(', ')} WHERE id = ?`,
    values,
  );

  return this.findDetailById(assemblyId, detailId, colegioId);
}
```

#### 10. removeDetail(assemblyId, detailId, colegioId) — Soft delete detalle

```typescript
async removeDetail(
  assemblyId: number,
  detailId: number,
  colegioId: number,
): Promise<{ message: string }> {
  await this.findDetailById(assemblyId, detailId, colegioId); // Verificar que existe

  await this.db.execute<ResultSetHeader>(
    'UPDATE detalle_asamblea SET deleted_at = NOW() WHERE id = ?',
    [detailId],
  );

  return { message: 'Detalle eliminado exitosamente' };
}
```

### Reglas de negocio

1. **Multi-tenant:** TODAS las queries filtran por `colegio_id`. Si `colegioId` es `null` (super_admin), se omiten los filtros de colegio en el listado.

2. **Soft delete:** Nunca DELETE físico. Siempre `deleted_at = NOW()`. Los queries de lectura SIEMPRE filtran por `deleted_at IS NULL`.

3. **Validación padre:** Antes de crear/editar/eliminar un detalle, verificar que la asamblea padre existe con `findOne()`.

4. **Mensajes de error:** En español, descriptivos. Ej: "Asamblea no encontrada", "Detalle de asamblea no encontrado".

5. **Null handling:** Usar `dto.field ?? null` para campos opcionales que mapean a columnas nullable.

6. **findOneWithDetails:** El endpoint GET `/assemblies/:id` debe retornar la asamblea con sus detalles anidados. El servicio debe tener un método que combine `findOne` y `findDetails`.

### Criterios de aceptación

- [ ] `assemblies.service.ts` creado con 11 métodos (incluye `findOneWithDetails`)
- [ ] Usa `DatabaseService` con SQL directo (NO TypeORM)
- [ ] Usa `executePaginatedQuery` para el listado principal
- [ ] Multi-tenant en todas las queries
- [ ] Soft delete implementado correctamente
- [ ] Mensajes de error en español

---

## Notas importantes

1. **`db.query` vs `db.execute`:**
   - `db.query<T[]>(sql, params)` → retorna array de filas (para SELECT)
   - `db.execute<ResultSetHeader>(sql, params)` → retorna metadatos (para INSERT, UPDATE, DELETE)

2. **Tipos de params:** Siempre `(string | number | boolean)[]`. Si necesitas pasar `null`, usar `null` directamente (mysql2 lo maneja).

3. **Patrón de actualización dinámica:** Construir `fields` y `values` arrays separados, luego unir con `', '.join(fields)`. Esto permite actualizar solo campos enviados.

4. **Reutilizar `findOne`:** Para verificar existencia, llamar `findOne` antes de update/delete. Si no existe, lanza `NotFoundException`.

5. **Logger:** Usar `this.logger.log()`, `this.logger.error()`, `this.logger.warn()` para debugging. El logger se crea con `new Logger(ServiceName.name)`.
