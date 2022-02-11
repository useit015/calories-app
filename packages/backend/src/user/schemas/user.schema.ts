import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from 'src/auth/enum/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    enum: Object.values(Role),
    required: true,
  })
  role: Role;

  @Prop({
    type: Number,
    default: 2100,
  })
  limit: number;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  referrer: User;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const hashed = await bcrypt.hash(this['password'], 10);

    this['password'] = hashed;

    return next();
  } catch (err) {
    return next(err);
  }
});
