import { IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ListarAsambleasDto {
  @ApiProperty({
    description: 'ID del colegio (se obtiene del JWT)',
    example: 1,
  })
  @IsNumber()
  colegio_id: number;

  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de resultados por página',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Fecha desde (formato ISO 8601)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  date_from?: string;

  @ApiPropertyOptional({
    description: 'Fecha hasta (formato ISO 8601)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  date_to?: string;
}
