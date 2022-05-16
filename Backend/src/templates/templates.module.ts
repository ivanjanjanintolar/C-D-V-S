import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesController } from './templates.controller';
import { Template } from './templates.entity';
import { TemplatesService } from './templates.service';

@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
