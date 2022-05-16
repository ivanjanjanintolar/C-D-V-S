import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { raw } from 'express';
import { error } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const rawUser = await this.usersService.findByUsername(user.username);
    if (!rawUser) {
      throw new BadRequestException('User does not exist');
    }

    const comparedPassword = await bcrypt.compare(
      user.password,
      rawUser.password,
    );

    if (!comparedPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const payload = { username: rawUser.username, id: rawUser.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
