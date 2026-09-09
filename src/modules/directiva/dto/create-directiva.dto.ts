import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDirectivaDto {
  @ApiProperty({ example: 1, description: 'ID del padre que ocupará el cargo' })
  @IsNumber()
  @IsNotEmpty()
  parent_id: number;

  @ApiProperty({
    example: 'presidente',
    description: 'Cargo de la directiva',
    enum: ['presidente', 'vicepresidente', 'tesorero', 'secretario', 'vocal'],
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  role: string;

  @ApiProperty({
    example: '2025-03-01',
    description: 'Fecha de inicio del mandato (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @ApiPropertyOptional({
    example: '2026-03-01',
    description: 'Fecha de fin del mandato (NULL = vigente)',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({
    example: 'Mandato 2025-2026',
    description: 'Notas sobre el mandato',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
