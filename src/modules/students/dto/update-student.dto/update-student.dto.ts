import { IsOptional, IsString, IsNumber, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStudentDto {
  @ApiPropertyOptional({
    example: 'Lucas',
    description: 'Nombre del estudiante',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'Pérez',
    description: 'Apellido del estudiante',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  surname?: string;

  @ApiPropertyOptional({ example: '1°', description: 'Grado del estudiante' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  grade?: string;

  @ApiPropertyOptional({ example: 'A', description: 'Sección del estudiante' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  section?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID del padre' })
  @IsOptional()
  @IsNumber()
  parent_id?: number;
}
