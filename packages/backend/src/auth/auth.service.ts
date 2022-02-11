import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async checkPassword(password: string, userPassword: string) {
    return bcrypt.compare(password, userPassword).then(Boolean);
  }

  getUser(userId: string) {
    return this.userService.getUserById(userId);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('Wrong username or password');
    }

    const isRightPassword = await this.checkPassword(password, user.password);

    if (!isRightPassword) {
      throw new NotFoundException('Wrong username or password');
    }

    const { password: _, ...result } = user;

    return result;
  }

  async login(user: UserDocument) {
    const { name, email, role, limit, _id: id } = user['_doc'];

    const token = this.jwtService.sign({ id });

    return {
      name,
      limit,
      email,
      token,
      role,
      id,
    };
  }
}
