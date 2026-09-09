import { IsNotEmpty, IsNumber, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AsignarRolDto {
  @ApiProperty({ example: 1, description: 'ID del colegio' })
  @IsNumber()
  @IsNotEmpty()
  colegio_id: number;

  @ApiProperty({
    example: 'presidente',
    enum: [
      'admin_colegio',
      'presidente',
      'vicepresidente',
      'tesorero',
      'secretario',
      'vocal',
      'padre',
    ],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn([
    'admin_colegio',
    'presidente',
    'vicepresidente',
    'tesorero',
    'secretario',
    'vocal',
    'padre',
  ])
  role: string;
}
