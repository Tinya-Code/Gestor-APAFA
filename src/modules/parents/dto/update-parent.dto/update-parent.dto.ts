import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateParentDto {
  @ApiPropertyOptional({ example: 'Juan', description: 'Nombre del padre' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Pérez', description: 'Apellido del padre' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  surname?: string;

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
}
