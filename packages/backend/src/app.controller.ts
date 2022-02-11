import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UserDocument } from './user/schemas/user.schema';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('whoami')
  @UseGuards(JwtAuthGuard)
  whoami(@Req() { user }: { user: UserDocument }) {
    return this.userService.whoami(user);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() { user }: { user: UserDocument }) {
    return this.authService.login(user);
  }

  @Post('invite')
  @UseGuards(JwtAuthGuard)
  invite(
    @Body() createUserDto: CreateUserDto,
    @Req() { user }: { user: UserDocument },
  ) {
    return this.userService.createUser(createUserDto, user);
  }
}
