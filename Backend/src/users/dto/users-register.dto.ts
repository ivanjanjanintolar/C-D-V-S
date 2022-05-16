import { IsNotEmpty, IsString } from 'class-validator';

export class UserRegisterDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  repeatPassword: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
