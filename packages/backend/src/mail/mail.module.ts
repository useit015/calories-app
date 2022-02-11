import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';

@Module({
  exports: [MailService],
  providers: [MailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<MailerOptions> => ({
        transport: {
          host: config.get<string>('MAIL_HOST', 'smtp.gmail.com'),
          port: config.get<number>('MAIL_PORT', 587),
          secure: false,
          auth: {
            pass: config.get<string>('MAIL_PASSWORD', '5x81KlFvy1'),
            user: config.get<string>(
              'MAIL_USER',
              'calories.app.team@gmail.com',
            ),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get<string>(
            'MAIL_FROM',
            'calories.app.team@gmail.com',
          )}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
})
export class MailModule {}
