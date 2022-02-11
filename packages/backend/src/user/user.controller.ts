import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateLimitDto } from './dto/update-limit.sto';
import { UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('limit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  whoami(
    @Body() { limit }: UpdateLimitDto,
    @Req() { user }: { user: UserDocument },
  ) {
    return this.userService.updateLimit(limit, user);
  }
}
