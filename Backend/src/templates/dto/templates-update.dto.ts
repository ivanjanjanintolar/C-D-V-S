import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateTemplateDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  x: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  y: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  width: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  height: string;

  @IsString()
  @IsOptional()
  scaledHeight: string;

  @IsString()
  @IsOptional()
  scaledWidth: string;
}
