import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTemplateDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  x: string;

  @IsString()
  @IsNotEmpty()
  y: string;

  @IsString()
  @IsNotEmpty()
  width: string;

  @IsString()
  @IsNotEmpty()
  height: string;

  @IsString()
  scaledHeight: string;

  @IsString()
  scaledWidth: string;
}

