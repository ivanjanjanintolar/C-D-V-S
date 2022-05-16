import { Injectable, Logger, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './certificates.entity';
import { CertificateCreateDTO } from './dto/certificate-create.dto';
import { CertificateDTO } from './dto/certificate.dto';
import { CertificateUpdateDTO } from './dto/certificate.update.dto';
import { PDFDocument } from 'pdf-lib';
import * as moment from 'moment';
import * as QRCode from 'qrcode';
import { readFile, writeFile } from 'fs/promises';
import * as crypto from 'crypto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';

@Injectable()
export class CertificatesService extends TypeOrmCrudService<Certificate> {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
  ) {
    super(certificateRepository);
  }

  public async generateFileHash(filePath): Promise<string> {
    const hash = crypto.createHash('sha1');
    const fileContent = await readFile(filePath);
    //@ts-ignore
    return hash.update(fileContent, 'sha1').digest('hex');
  }

  public async generateQRCodeImage(filePath, text, color): Promise<void> {
    return new Promise((resolve, reject) => {
      QRCode.toFile(
        filePath,
        text,
        {
          color,
        },
        function (err) {
          if (err) return reject(err);
          resolve();
        },
      );
    });
  }

  public async run({
    scaledPdfHeight,
    scaledPdfWidth,
    width,
    height,
    x,
    y,
    pathToImage,
    pathToPDF,
    qrCodeText,
    qrDarkColor = '#000',
    qrLightColor = '#0000',
  }) {
    await this.generateQRCodeImage(pathToImage, qrCodeText, {
      dark: qrDarkColor,
      light: qrLightColor,
    });

    const pdfDoc = await PDFDocument.load(await readFile(pathToPDF));
    const img = await pdfDoc.embedPng(await readFile(pathToImage));

    Array.from({ length: 1 }).forEach((_, index) => {
      const imagePage = pdfDoc.getPage(index);
      const calculatedWidth = imagePage.getWidth() / scaledPdfWidth;
      const calculatedHeight = imagePage.getHeight() / scaledPdfHeight;
      imagePage.drawImage(img, {
        x: x * calculatedWidth,
        y:
          imagePage.getHeight() -
          (y * calculatedHeight + height * calculatedHeight),
        width: width * calculatedWidth,
        height: height * calculatedHeight,
      });
    });

    const pdfBytes = await pdfDoc.save();
    const newFilePath = './certificate-uploads/' + Date.now() + 'output.pdf';

    await writeFile(newFilePath, pdfBytes);

    return newFilePath;
  }

  public async saveFile(
    file: Express.Multer.File,
    certificateCreate: CertificateCreateDTO,
    userId: number,
  ): Promise<CertificateDTO> {
    const fileSize = file.size;
    const fileType = file.mimetype;
    const sourceUrl = file.path;
    const createdAt = moment().format();
    const pathToImage = './certificate-uploads/' + Date.now() + 'qr.png';

    const savedCertificate = await this.certificateRepository.save({
      ...certificateCreate,
      fileSize: fileSize.toString(),
      fileType,
      sourceUrl,
      createdAt,
      userId,
    });

    const qrCodeCertificateSourceUrl = await this.run({
      scaledPdfHeight: +certificateCreate.scaledPdfHeight,
      scaledPdfWidth: +certificateCreate.scaledPdfWidth,
      x: +certificateCreate.x,
      y: +certificateCreate.y,
      height: +certificateCreate.height,
      width: +certificateCreate.width,
      pathToImage,
      pathToPDF: sourceUrl,
      qrCodeText:
        certificateCreate.qrCodeText + '/' + savedCertificate.fileHash,
    });

    const verifiedHash = await this.generateFileHash(
      qrCodeCertificateSourceUrl,
    );

    return this.certificateRepository.save({
      ...savedCertificate,
      verifiedHash,
      sourceUrl: qrCodeCertificateSourceUrl.replace('./', ''),
      userId,
    });
  }

  public async updateCertificate(
    updateCertificate: CertificateUpdateDTO,
    id,
    userId: number,
  ) {
    const certificate = await this.certificateRepository.findOne({ id });

    return this.certificateRepository.save({
      ...certificate,
      ...updateCertificate,
      userId,
    });
  }

  public async getByFileHash(fileHash: string) {
    return this.certificateRepository.findOneOrFail({ fileHash });
  }
}
