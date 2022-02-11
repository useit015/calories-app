import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type MealDocument = Meal & Document;

@Schema({ timestamps: true })
export class Meal {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  author: User;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  calories: number;

  @Prop({
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  })
  content: string;

  @Prop({
    type: Date,
    required: true,
  })
  date: Date;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
