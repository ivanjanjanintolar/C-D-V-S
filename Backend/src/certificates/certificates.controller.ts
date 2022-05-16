import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Crud, CrudAuth } from '@nestjsx/crud';
import { Certificate } from './certificates.entity';
import { CertificatesService } from './certificates.service';
import { CertificateCreateDTO } from './dto/certificate-create.dto';
import { CertificateDTO } from './dto/certificate.dto';
import { CertificateUpdateDTO } from './dto/certificate.update.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/users.entity';
import { CrudController } from '@nestjsx/crud';

export const editFileName = (req, file, callback) => {
  const fileExtName = extname(file.originalname.replace(' ', ''));
  const randomName = Array(16)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${randomName}${fileExtName}`);
};

@Crud({
  model: {
    type: Certificate,
  },
  query: {
    limit: 10000000,
    sort: [],
    exclude: [],
    filter: { userId: {} },
  },
  routes: {
    getOneBase: { decorators: [UseGuards(JwtAuthGuard)] },
    getManyBase: { decorators: [UseGuards(JwtAuthGuard)] },
    only: ['getOneBase', 'getManyBase'],
  },
})
@CrudAuth({
  property: 'user',
  filter: (user: User) => ({
    userId: user.id,
  }),
})
@Controller('certificates')
export class CertificatesController implements CrudController<Certificate> {
  constructor(public service: CertificatesService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './certificate-uploads',
        filename: editFileName,
      }),
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Body() certificatesData: CertificateCreateDTO,
  ): Promise<CertificateDTO> {
    return this.service.saveFile(
      file,
      {
        ...certificatesData,
      },
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Body() certificateUpdateDTO: CertificateUpdateDTO,
    @Param() params,
    @Request() req,
  ) {
    return this.service.updateCertificate(
      certificateUpdateDTO,
      params.id,
      req.user.id,
    );
  }

  @Get('certificate-uploads/:path')
  serveUploaded(@Param('path') image, @Res() res) {
    return res.sendFile(image, { root: './certificate-uploads' });
  }

  @Get('preview/:fileHash')
  previewCertificates(@Param('fileHash') fileHash: string) {
    return this.service.getByFileHash(fileHash);
  }
}
