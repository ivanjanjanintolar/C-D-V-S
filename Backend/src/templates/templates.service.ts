import { Injectable } from '@nestjs/common';
import { Template } from './templates.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { CreateTemplateDTO } from './dto/templates-create.dto';
import { UpdateTemplateDTO } from './dto/templates-update.dto';

@Injectable()
export class TemplatesService extends TypeOrmCrudService<Template> {
  constructor(
    @InjectRepository(Template)
    private readonly templatesRepository: Repository<Template>,
  ) {
    super(templatesRepository);
  }

  async create(
    createTemplateDTO: CreateTemplateDTO,
    userId: number,
  ): Promise<Template> {
    return this.templatesRepository.save({ ...createTemplateDTO, userId });
  }

  async update(
    updateTemplateDTO: UpdateTemplateDTO,
    userId: number,
    id: number,
  ): Promise<Template> {
    const existingTemplate = await this.templatesRepository.findOneOrFail({
      id,
    });

    return this.templatesRepository.save({
      ...existingTemplate,
      ...updateTemplateDTO,
      userId,
    });
  }
}
