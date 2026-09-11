# M4 — T2: DTOs y Validaciones

**Módulo:** Asambleas
**Directorio a crear:** `src/modules/assemblies/dto/`
**Referencia:** `src/modules/directiva/dto/` (patrón de DTOs existentes)

---

## Contexto general

Los DTOs (Data Transfer Objects) definen la forma de los datos que reciben los endpoints. Cada campo usa decoradores de `class-validator` para validación y `@nestjs/swagger` para documentación automática.

### Convenciones del proyecto

- **Archivos:** Un DTO por archivo, nombre en kebab-case (`create-assembly.dto.ts`)
- **Imports de validación:** Siempre desde `class-validator`
- **Imports de Swagger:** Siempre desde `@nestjs/swagger`
- **Campos requeridos:** `@IsNotEmpty()` + `@IsString()` / `@IsNumber()` / `@IsDateString()` + decorador Swagger
- **Campos opcionales:** `@IsOptional()` + validación + `@ApiPropertyOptional()`
- **Longitud máxima:** `@MaxLength(255)` en strings que mapean a VARCHAR(255)
- **Fechas:** `@IsDateString()` para strings en formato YYYY-MM-DD
- **Números:** `@IsNumber()` para enteros, `@IsNumber({}, { each: true })` para arrays
- **Transformación en queries:** `@Type(() => Number)` de `class-transformer` para convertir query params string a number

### Import base para cada DTO

```typescript
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
```

---

## T2.1 — Crear DTOs de asamblea

Crear la carpeta `src/modules/assemblies/dto/` y dentro tres archivos.

### CreateAssemblyDto — `create-assembly.dto.ts`

```typescript
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssemblyDto {
  @ApiProperty({
    example: 'Asamblea Ordinaria 2025',
    description: 'Nombre o tema de la asamblea',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: '2025-06-15',
    description: 'Fecha de realización de la asamblea (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({
    example: 'Se discutió el presupuesto del próximo trimestre',
    description: 'Detalle de temas tratados en la asamblea',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
```

**Por qué estos decoradores:**
- `@IsString()` + `@MaxLength(255)` → valida que sea texto y no exceda VARCHAR(255)
- `@IsDateString()` → valida formato ISO YYYY-MM-DD (no valida que la fecha exista, solo el formato)
- `@IsOptional()` → el campo puede ser omitido o null en el body

### UpdateAssemblyDto — `update-assembly.dto.ts`

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateAssemblyDto } from './create-assembly.dto';

export class UpdateAssemblyDto extends PartialType(CreateAssemblyDto) {}
```

**Qué hace `PartialType`:**
- Convierte todos los campos del DTO padre en opcionales
- Mantiene las mismas validaciones y documentación Swagger
- Si el campo no se envía, no se modifica en la base de datos

### QueryAssemblyDto — `query-assembly.dto.ts`

```typescript
import { IsOptional, IsString, IsNumber, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryAssemblyDto {
  @ApiPropertyOptional({ example: 1, description: 'Número de página' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Elementos por página (máx 100)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ example: 'presupuesto', description: 'Buscar por título' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: '2025-01-01', description: 'Fecha desde (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  date_from?: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Fecha hasta (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  date_to?: string;
}
```

**Por qué `@Type(() => Number)`:**
- Los query params siempre llegan como string (`?page=1` → `"1"`)
- `@Type(() => Number)` convierte `"1"` a `1` antes de las validaciones
- Sin esto, `@IsNumber()` fallaría porque recibe un string

### Criterios de aceptación

- [ ] Carpeta `src/modules/assemblies/dto/` creada
- [ ] `create-assembly.dto.ts` con validaciones y Swagger
- [ ] `update-assembly.dto.ts` usando `PartialType`
- [ ] `query-assembly.dto.ts` con page, limit, search, date_from, date_to
- [ ] Todos los campos tienen `@ApiProperty` o `@ApiPropertyOptional`
- [ ] Patrón consistente con DTOs de directiva

---

## T2.2 — Crear DTOs de detalle de asamblea

Dentro de la misma carpeta, crear dos archivos.

### CreateAssemblyDetailDto — `create-assembly-detail.dto.ts`

```typescript
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssemblyDetailDto {
  @ApiProperty({
    example: 'Se aprobó el presupuesto para materiales escolares',
    description: 'Nota o acuerdo registrado en la asamblea',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '2025-06-15',
    description: 'Fecha de registro del detalle (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  registration_date: string;

  @ApiPropertyOptional({
    example: 'https://storage.example.com/actas/acta-2025-06-15.jpg',
    description: 'URL de la foto del acta (máximo 500 caracteres)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  image_url?: string;
}
```

### UpdateAssemblyDetailDto — `update-assembly-detail.dto.ts`

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateAssemblyDetailDto } from './create-assembly-detail.dto';

export class UpdateAssemblyDetailDto extends PartialType(CreateAssemblyDetailDto) {}
```

### Criterios de aceptación

- [ ] `create-assembly-detail.dto.ts` con validaciones y Swagger
- [ ] `update-assembly-detail.dto.ts` usando `PartialType`
- [ ] Patrón consistente con DTOs de directiva

---

## Notas importantes

1. **No agregar `colegio_id` al DTO:** El `colegio_id` se extrae del JWT token en el controller usando `@ColegioId()`. El frontend NUNCA lo envía.

2. **No agregar `id` al DTO de creación:** El `id` se genera automáticamente en la base de datos.

3. **`PartialType` vs campos individuales:** Usar `PartialType` es más limpio y mantiene la consistencia. Si necesitas un campo opcional en Create, ya está cubierto por PartialType en Update.

4. **Validación de fechas:** `@IsDateString()` valida el formato, pero NO valida que la fecha sea real (ej: "2025-02-30" pasaría). Si necesitas validación de fechas reales, usar `class-validator` con `@ValidatorDecorator` personalizado.
