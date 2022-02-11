import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ValidateObjectId } from 'src/common/pipes/validate-object-id.pipes';
import { UserDocument } from 'src/user/schemas/user.schema';
import { CreateMealDto } from './dto/create-meal.dto';
import { GetMealsQuery } from './dto/get-meal.dto';
import { UpdateMealDto } from './dto/update-meal.sto';
import { MealService } from './meal.service';

@Controller('meal')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Get('/')
  getUserMeals(
    @Query() { period }: GetMealsQuery,
    @Req() { user }: { user: UserDocument },
  ) {
    return user.role === Role.Admin
      ? this.mealService.getAllMeals(period)
      : this.mealService.getUserMeals(user._id, period);
  }

  @Post('/')
  @Roles(Role.User)
  createMeal(
    @Req() { user }: { user: UserDocument },
    @Body() createMealDto: CreateMealDto,
  ) {
    return this.mealService.createMeal(createMealDto, user._id);
  }

  @Patch(':id')
  updateMeal(
    @Param('id', new ValidateObjectId()) id: string,
    @Req() { user }: { user: UserDocument },
    @Body() updateMealDto: UpdateMealDto,
  ) {
    return this.mealService.updateMeal(id, updateMealDto, user);
  }

  @Delete(':id')
  deleteMeal(
    @Param('id', new ValidateObjectId()) id: string,
    @Req() { user }: { user: UserDocument },
  ) {
    return this.mealService.deleteMeal(id, user);
  }
}
