import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMealDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  calories: number;

  @IsNotEmpty()
  @MinLength(1)
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  @IsDateString()
  date: string;
}
