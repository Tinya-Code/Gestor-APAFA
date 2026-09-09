import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SwitchColegioDto {
  @ApiProperty({
    example: 1,
    description: 'ID del colegio al que se desea cambiar',
  })
  @IsNumber()
  @IsNotEmpty()
  colegio_id: number;
}
