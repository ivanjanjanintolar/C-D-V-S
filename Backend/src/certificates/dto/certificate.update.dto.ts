import { IsIn, IsString } from 'class-validator';

export class CertificateUpdateDTO {
  @IsString()
  blockchainUploadDate: string;

  @IsString()
  @IsIn(['ADDED_TO_BLOCKCHAIN'])
  status: string;

  @IsString()
  description: string;
}
