import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './certificates/certificates.entity';
import { CertificatesModule } from './certificates/certificates.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { User } from './users/users.entity';
import { UsersController } from './users/users.controller';
import { TemplatesModule } from './templates/templates.module';
import { Template } from './templates/templates.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST || 'localhost',
      port: Number.parseInt(process.env.PG_PORT || '5432', 10),
      username: process.env.PG_USERNAME || 'root',
      password: process.env.PG_PASSWORD || '123456',
      database: process.env.PG_DATABASE || 'cotrugli_db',
      entities: [Certificate, User, Template],
      synchronize: true,
    }),
    MulterModule.register({
      dest: './certificate-uploads',
    }),
    CertificatesModule,
    AuthModule,
    UsersModule,
    TemplatesModule,
  ],
  controllers: [AppController, UsersController],
  providers: [],
})
export class AppModule {}
