import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDirectivaDto {
  @ApiPropertyOptional({
    example: 2,
    description: 'ID del padre (para transferir el cargo)',
  })
  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @ApiPropertyOptional({
    example: 'vicepresidente',
    description: 'Nuevo cargo',
    enum: ['presidente', 'vicepresidente', 'tesorero', 'secretario', 'vocal'],
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  role?: string;

  @ApiPropertyOptional({
    example: '2025-06-01',
    description: 'Nueva fecha de inicio',
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    example: '2026-06-01',
    description: 'Nueva fecha de fin (NULL = vigente)',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({ example: 'Actualizado por cambio de junta' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({ example: false, description: 'Desactivar mandato' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
