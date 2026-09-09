import { IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryDirectivaDto {
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
    example: 'presidente',
    description: 'Filtrar por rol de directiva',
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Solo mandatos vigentes (end_date IS NULL)',
  })
  @IsOptional()
  @Type(() => Boolean)
  current?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Solo mandatos activos (is_active = 1)',
  })
  @IsOptional()
  @Type(() => Boolean)
  is_active?: boolean;
}
