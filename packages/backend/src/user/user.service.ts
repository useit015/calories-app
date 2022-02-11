import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/auth/enum/role.enum';
import { MailService } from 'src/mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly passwordCharset: string =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (!(await this.findDefaultAdmin())) {
      await this.createDefaultAdmin();
    }
  }

  private findDefaultAdmin(): Promise<UserDocument> {
    return this.userModel
      .findOne({
        role: Role.Admin,
        username: this.configService.get<string>('DEFAULT_ADMIN_EMAIL'),
      })
      .exec();
  }

  private createDefaultAdmin(): Promise<UserDocument> {
    return this.userModel.create({
      referrer: null,
      role: Role.Admin,
      name: this.configService.get<string>('DEFAULT_ADMIN_NAME'),
      email: this.configService.get<string>('DEFAULT_ADMIN_EMAIL'),
      limit: this.configService.get<number>('DEFAULT_CALORIES_LIMIT'),
      password: this.configService.get<string>('DEFAULT_ADMIN_PASSWORD'),
    });
  }

  private generateRandomPassword(length = 10): string {
    const getRandomChar = (): string =>
      this.passwordCharset.charAt(
        Math.floor(Math.random() * this.passwordCharset.length),
      );

    return new Array(length).fill(0).map(getRandomChar).join('');
  }

  private async sendUserInvitation(
    newUser: UserDocument,
    password: string,
    referrer: string,
  ): Promise<CreateUserDto> {
    try {
      const { name, email } = newUser;

      await this.mailService.sendUserInvitation(
        referrer,
        email,
        name,
        password,
      );

      return {
        name,
        email,
      };
    } catch {
      await newUser.delete();

      throw new BadRequestException('cannot create user :(');
    }
  }

  async createUser(
    { name, email }: CreateUserDto,
    referrer: UserDocument,
  ): Promise<CreateUserDto> {
    const password = this.generateRandomPassword();

    const existingUser = await this.getUserByEmail(email);

    if (existingUser) {
      throw new BadRequestException('user already exists');
    }

    const newUser = await this.userModel.create({
      limit: this.configService.get<number>('DEFAULT_CALORIES_LIMIT'),
      referrer: referrer._id,
      role: Role.User,
      password,
      email,
      name,
    });

    if (!newUser) {
      throw new BadRequestException('cannot create user :(');
    }

    return this.sendUserInvitation(newUser, password, referrer.name);
  }

  async updateLimit(limit: number, user: UserDocument) {
    user.limit = limit;

    await user.save();

    return {
      message: 'ok',
    };
  }

  whoami(user: UserDocument) {
    const { name, email, role, limit, _id: id } = user.toObject();

    return {
      name,
      limit,
      email,
      role,
      id,
    };
  }

  getUserById(userId: string): Promise<UserDocument> {
    return this.userModel.findById(userId).exec();
  }

  getUserByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }
}
