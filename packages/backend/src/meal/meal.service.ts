import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Role } from 'src/auth/enum/role.enum';
import { chunk } from 'src/common/utils/chunk';
import { UserDocument } from 'src/user/schemas/user.schema';
import { CreateMealDto } from './dto/create-meal.dto';
import { MealPeriod } from './dto/get-meal.dto';
import { UpdateMealDto } from './dto/update-meal.sto';
import { Meal, MealDocument } from './schemas/meal.schema';

export interface IDailyMeal {
  day?: string;
  week?: string;
  total: number;
  entries: Meal[];
}

export interface IUserMeal {
  total: number;
  entries: IDailyMeal[];
}

export interface IMealStats {
  [key: string]: any;
}

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private readonly mealModel: Model<MealDocument>,
  ) {}

  private accumulateCalories(meals: Meal[]): number {
    return meals.reduce<number>((acc, { calories }) => acc + calories, 0);
  }

  private getLastTwoWeeksDate(): string {
    const date = new Date();

    date.setDate(date.getDate() - 14);

    return date.toISOString().slice(0, 10);
  }

  private accumulateDailyMeals(
    newMeal: Meal,
    previousMeals: Meal[] | undefined,
  ): IDailyMeal {
    const entries = [...(previousMeals ?? []), newMeal];

    const total = this.accumulateCalories(entries);

    return {
      total,
      entries,
    };
  }

  private fillEmptyDays(days: IDailyMeal[]): IDailyMeal[] {
    return days
      .sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime())
      .reduce<IDailyMeal[]>((acc, currentDay, i, array) => {
        if (i) {
          const day = new Date(array[i - 1].day);

          const currentDate = new Date(currentDay.day);

          while (true) {
            day.setDate(day.getDate() - 1);

            if (day <= currentDate) {
              break;
            }

            acc.push({
              day: day.toISOString().slice(0, 10),
              entries: [],
              total: 0,
            });
          }
        }

        return [...acc, currentDay];
      }, []);
  }

  private groupMealsByDays(meals: Meal[]): Record<string, IDailyMeal> {
    return meals.reduce<Record<string, IDailyMeal>>(
      (acc, meal) => {
        const day = meal.date.toISOString().slice(0, 10);

        return {
          ...acc,
          [day]: this.accumulateDailyMeals(meal, acc[day]?.entries),
        };
      },
      {
        [new Date().toISOString().slice(0, 10)]: {
          total: 0,
          entries: [],
        },
        [this.getLastTwoWeeksDate()]: {
          total: 0,
          entries: [],
        },
      },
    );
  }

  private splitMealsByDays(meals: Meal[]): IDailyMeal[] {
    const mealsByDays = this.groupMealsByDays(meals);

    return this.fillEmptyDays(
      Object.entries(mealsByDays).map(([day, { entries, total }]) => ({
        entries: entries.sort((a, b) => b.date.getTime() - a.date.getTime()),
        total,
        day,
      })),
    );
  }

  private splitMealsByWeeks(
    meals: Meal[],
    dailyMeals = this.splitMealsByDays(meals),
  ): IDailyMeal[] {
    return chunk<IDailyMeal>(dailyMeals, 7).reduce(
      (acc, week) => [
        ...acc,
        {
          week: [week[0]?.day, week[week.length - 1]?.day]
            .filter(Boolean)
            .join(' - '),
          ...week.reduce(
            (acc, { total, entries }) => ({
              ...acc,
              total: acc.total + total,
              entries: [...acc.entries, ...entries],
            }),
            {
              total: 0,
              entries: [],
            },
          ),
        },
      ],
      [],
    );
  }

  private addTotalCalories(meals: IDailyMeal[]): IUserMeal {
    return meals.reduce<IUserMeal>(
      ({ total }, entry, _, entries) => ({
        total: total + entry.total,
        entries,
      }),
      {
        total: 0,
        entries: [],
      },
    );
  }

  private formatMeals(meals: Meal[], period: MealPeriod): IUserMeal {
    return this.addTotalCalories(
      period === MealPeriod.DAY
        ? this.splitMealsByDays(meals)
        : this.splitMealsByWeeks(meals),
    );
  }

  private getUsersAverages(meals: Meal[]) {
    return Object.entries(
      meals.reduce<Record<string, number[]>>(
        (acc, { author, calories }) => ({
          ...acc,
          [author.name]: [...(acc[author.name] ?? []), calories],
        }),
        {},
      ),
    ).reduce(
      (acc, [name, calories]) => ({
        ...acc,
        [name]: {
          meals: calories?.length ?? 0,
          calories: calories
            ? calories.reduce((acc, calories) => acc + calories, 0) /
              calories.length
            : 0,
        },
      }),
      {},
    );
  }

  private withStats({ total, entries }: IUserMeal): IUserMeal & IMealStats {
    return {
      total,
      entries,
      stats: this.splitMealsByWeeks([], entries).map(
        ({ total, entries, week }) => ({
          average: total ? total / entries.length : 0,
          users: this.getUsersAverages(entries),
          total,
          week,
        }),
      ),
    };
  }

  private async findMeal(
    _id: string,
    user: UserDocument,
  ): Promise<MealDocument> {
    const filter: FilterQuery<MealDocument> = {
      _id,
    };

    if (user.role !== Role.Admin) {
      filter.author = user._id;
    }

    const meal = await this.mealModel.findOne(filter).exec();

    if (!meal) {
      throw new BadRequestException('Cannot find meal :(');
    }

    return meal;
  }

  async getAllMeals(period: MealPeriod): Promise<IUserMeal & IMealStats> {
    const meals = await this.mealModel
      .find({
        date: {
          $gte: new Date(this.getLastTwoWeeksDate()),
        },
      })
      .populate({
        path: 'author',
        select: 'name email',
      })
      .exec();

    return this.withStats(this.formatMeals(meals, period));
  }

  async getUserMeals(author: string, period: MealPeriod): Promise<IUserMeal> {
    const userMeals = await this.mealModel
      .find({
        author,
        date: {
          $gte: new Date(this.getLastTwoWeeksDate()),
        },
      })
      .exec();

    return this.formatMeals(userMeals, period);
  }

  async createMeal(
    newMeal: CreateMealDto,
    author: string,
  ): Promise<MealDocument> {
    const meal = new this.mealModel({ ...newMeal, author });

    return meal.save();
  }

  async updateMeal(
    mealId: string,
    updatedMeal: UpdateMealDto,
    author: UserDocument,
  ): Promise<MealDocument> {
    const meal = await this.findMeal(mealId, author);

    Object.entries(updatedMeal).forEach(([key, value]) => {
      meal[key] = value;
    });

    return meal.save();
  }

  async deleteMeal(
    mealId: string,
    author: UserDocument,
  ): Promise<MealDocument> {
    const meal = await this.findMeal(mealId, author);

    return meal.delete();
  }
}
