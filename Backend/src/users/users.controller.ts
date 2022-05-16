import { Body, Controller } from '@nestjs/common';
import { UseGuards, Get, Post, Request } from '@nestjs/common';
import { UserRegisterDTO } from './dto/users-register.dto';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BadRequestException } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.service.findByUsername(req.user.username);
  }

  @Post('register')
  async register(@Body() userRegisterDTO: UserRegisterDTO) {
    const user = await this.service.findByUsername(userRegisterDTO.username);
    if (user) {
      throw new BadRequestException('User with this username already exists');
    }
    const hashedPassword = await bcrypt
      .hash(userRegisterDTO.password, 10)
      .then(function (hash) {
        // Store hash in your password DB.
        //return this.service.saveUser({ userRegisterDTO, password: hash });
        return hash;
      });

    const hashedRepeatedPassword = await bcrypt
      .hash(userRegisterDTO.repeatPassword, 10)
      .then(function (hash) {
        // Store hash in your password DB.
        //return this.service.saveUser({ userRegisterDTO, password: hash });
        return hash;
      });

    return (
      this.service.saveUser({
        ...userRegisterDTO,
        password: hashedPassword,
        repeatPassword: hashedRepeatedPassword,
      }),
      'User created with success'
    );
  }
}
