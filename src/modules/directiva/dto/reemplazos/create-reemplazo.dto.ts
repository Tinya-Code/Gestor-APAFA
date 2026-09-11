import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Roles que pueden ser reemplazados por un vocal.
 * Un vocal NO puede reemplazar a otro vocal ni a presidente.
 */
const REEMPLAZABLE_ROLES = [
  'vicepresidente',
  'tesorero',
  'secretario',
] as const;

export class CreateReemplazoDto {
  @ApiProperty({
    example: 3,
    description: 'ID del padre vocal que reemplazará',
  })
  @IsNumber()
  @IsNotEmpty()
  vocal_parent_id: number;

  @ApiProperty({
    example: 'tesorero',
    description:
      'Rol que será reemplazado (vicepresidente, tesorero o secretario)',
    enum: REEMPLAZABLE_ROLES,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(REEMPLAZABLE_ROLES)
  replaced_role: string;

  @ApiProperty({
    example: 2,
    description: 'ID del padre directivo que será reemplazado',
  })
  @IsNumber()
  @IsNotEmpty()
  replaced_parent_id: number;

  @ApiProperty({
    example: '2025-09-07T10:00:00',
    description: 'Fecha y hora de inicio del reemplazo (ISO 8601)',
  })
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @ApiPropertyOptional({
    example: '2025-09-14T18:00:00',
    description: 'Fecha y hora de fin del reemplazo (NULL = indefinido)',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({
    example: 'Tesorera con licencia médica por una semana',
    description: 'Motivo del reemplazo',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
