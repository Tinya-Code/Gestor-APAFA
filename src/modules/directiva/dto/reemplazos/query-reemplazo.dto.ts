import { IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryReemplazoDto {
  @ApiPropertyOptional({ default: 1, description: 'Número de página' })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    default: 10,
    description: 'Elementos por página (máx 100)',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'tesorero',
    description: 'Filtrar por rol reemplazado',
  })
  @IsOptional()
  @IsString()
  replaced_role?: string;

  @ApiPropertyOptional({
    example: 3,
    description: 'Filtrar por vocal que reemplaza',
  })
  @IsOptional()
  @Type(() => Number)
  vocal_parent_id?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Solo reemplazos activos',
  })
  @IsOptional()
  @Type(() => Boolean)
  is_active?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Solo reemplazos vigentes (end_date IS NULL o futuros)',
  })
  @IsOptional()
  @Type(() => Boolean)
  current?: boolean;
}
