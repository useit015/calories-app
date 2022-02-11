import { IsEnum, IsOptional } from 'class-validator';

export enum MealPeriod {
  DAY = 'day',
  WEEK = 'week',
}

export class GetMealsQuery {
  @IsOptional()
  @IsEnum(MealPeriod)
  period: MealPeriod = MealPeriod.DAY;
}
