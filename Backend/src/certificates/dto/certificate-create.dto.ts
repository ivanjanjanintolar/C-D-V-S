import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CertificateCreateDTO {
  @IsString()
  fileName: string;

  @IsString()
  fileHash: string;

  @IsString()
  qrCodeText: string;

  @IsString()
  @Optional()
  description: string;

  @IsNumberString()
  @IsNotEmpty()
  x: string;

  @IsNumberString()
  @IsNotEmpty()
  y: string;

  @IsNumberString()
  @IsNotEmpty()
  width: string;

  @IsNumberString()
  @IsNotEmpty()
  height: string;

  @IsNumberString()
  @IsNotEmpty()
  scaledPdfHeight: string;

  @IsNumberString()
  @IsNotEmpty()
  scaledPdfWidth: string;
}
