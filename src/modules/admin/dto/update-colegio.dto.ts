import { IsOptional, IsString, IsBoolean, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateColegioDto {
  @ApiPropertyOptional({
    example: 'Colegio San Miguel',
    description: 'Nombre del colegio',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({
    example: 'colegio-san-miguel',
    description: 'Slug URL-friendly',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;

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

  @ApiPropertyOptional({
    example: true,
    description: 'Si el colegio está activo',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
