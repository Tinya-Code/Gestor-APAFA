import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateColegioDto {
  @ApiProperty({
    example: 'Colegio San Miguel',
    description: 'Nombre del colegio',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    example: 'colegio-san-miguel',
    description: 'Slug URL-friendly',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string;

  @ApiPropertyOptional({
    example: 'Av. Principal 1234',
    description: 'Dirección',
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @ApiPropertyOptional({ example: '+5491155550000', description: 'Teléfono' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: 'info@colegio.edu.ar', description: 'Email' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({
    example: 'https://logo.png',
    description: 'URL del logo',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  logo_url?: string;
}
