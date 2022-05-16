import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { UserLoginDTO } from './users/dto/users-login.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() userLoginDTO: UserLoginDTO) {
    return this.authService.login(userLoginDTO);
  }
}
