import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateParentDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre del padre' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del padre' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  surname: string;

  @ApiProperty({ example: '30123456', description: 'DNI del padre' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  dni: string;

  @ApiPropertyOptional({
    example: '+5491155551234',
    description: 'Teléfono del padre',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({
    example: 'juan.perez@email.com',
    description: 'Email del padre',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID del usuario asociado (si se registra)',
  })
  @IsOptional()
  @IsNumber()
  usuario_id?: number;
}
