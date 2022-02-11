import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserInvitation(
    referrer: string,
    email: string,
    name: string,
    password: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: `${referrer.toUpperCase()} invited to join the calories app !`,
      template: 'invite',
      context: {
        password,
        email,
        name,
      },
    });
  }
}
