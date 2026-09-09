import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 'Lucas', description: 'Nombre del estudiante' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del estudiante' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  surname: string;

  @ApiProperty({ example: '1°', description: 'Grado del estudiante' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  grade: string;

  @ApiPropertyOptional({ example: 'A', description: 'Sección del estudiante' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  section?: string;

  @ApiProperty({ example: 1, description: 'ID del padre' })
  @IsNumber()
  @IsNotEmpty()
  parent_id: number;
}
