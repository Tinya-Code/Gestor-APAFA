import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  surname: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  grade: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  section: string;

  @IsInt()
  @IsPositive()
  parent_id: number;
}
