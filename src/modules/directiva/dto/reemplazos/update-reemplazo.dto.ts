import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReemplazoDto {
  @ApiPropertyOptional({
    example: '2025-09-21T18:00:00',
    description: 'Nueva fecha de fin del reemplazo',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({
    example: 'Extensión por recuperación',
    description: 'Motivo actualizado del reemplazo',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Desactivar reemplazo manualmente',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
