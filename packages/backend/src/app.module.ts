import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { MealModule } from './meal/meal.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';

@Module({
  controllers: [AppController],
  imports: [
    MailModule,
    UserModule,
    MealModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(
          'MONGO_URI',
          'mongodb://localhost:27017/calories',
        ),
      }),
    }),
  ],
})
export class AppModule {}
