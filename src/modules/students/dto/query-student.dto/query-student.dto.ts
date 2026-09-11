import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryStudentDto {
  @ApiPropertyOptional({ example: 1, description: 'Número de página' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Elementos por página' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    example: 'Pérez',
    description: 'Buscar por nombre o apellido',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: '1°', description: 'Filtrar por grado' })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Filtrar por colegio (solo super_admin)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  colegio_id?: number;
}
