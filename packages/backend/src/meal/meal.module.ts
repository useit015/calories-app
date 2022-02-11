import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MealService } from './meal.service';
import { Meal, MealSchema } from './schemas/meal.schema';
import { MealController } from './meal.controller';

@Module({
  controllers: [MealController],
  providers: [MealService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Meal.name,
        schema: MealSchema,
      },
    ]),
  ],
})
export class MealModule {}
