import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateLimitDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  limit: number;
}
