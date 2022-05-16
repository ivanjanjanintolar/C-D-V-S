import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDTO } from './dto/templates-create.dto';
import { UpdateTemplateDTO } from './dto/templates-update.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Template } from './templates.entity';
import { User } from 'src/users/users.entity';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

@Crud({
  model: {
    type: Template,
  },
  query: {
    limit: 9999,
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
@Controller('templates')
export class TemplatesController implements CrudController<Template> {
  constructor(public service: TemplatesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createTemplate(
    @Body() createTemplateDTO: CreateTemplateDTO,
    @Request() req,
  ) {
    return this.service.create(createTemplateDTO, +req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  async updateTemplate(
    @Body() updateTemplateDTO: UpdateTemplateDTO,
    @Request() req,
    @Param('id') id,
  ) {
    return this.service.update(updateTemplateDTO, +req.user.id, +id);
  }
}
