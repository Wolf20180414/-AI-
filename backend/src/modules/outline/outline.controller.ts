import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { OutlineService } from './outline.service';
import { CreateOutlineDto, UpdateOutlineDto } from './dto';

@Controller('projects/:projectId/outlines')
export class OutlineController {
  constructor(private readonly outlineService: OutlineService) {}

  // 创建大纲
  @Post()
  create(@Param('projectId') projectId: string, @Body() dto: CreateOutlineDto) {
    return this.outlineService.create(projectId, dto);
  }

  // 获取所有大纲
  @Get()
  findAll(@Param('projectId') projectId: string) {
    return this.outlineService.findAllByProject(projectId);
  }

  // 获取单个大纲
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.outlineService.findOne(id);
  }

  // 更新大纲
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOutlineDto) {
    return this.outlineService.update(id, dto);
  }

  // 删除大纲
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outlineService.remove(id);
  }
}