import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { WorldService } from './world.service';
import { CreateWorldDto, UpdateWorldDto } from './dto';

@Controller('projects/:projectId/worlds')
export class WorldController {
  constructor(private readonly worldService: WorldService) {}

  // 创建世界观设定
  @Post()
  create(@Param('projectId') projectId: string, @Body() dto: CreateWorldDto) {
    return this.worldService.create(projectId, dto);
  }

  // 获取所有世界观设定
  @Get()
  findAll(@Param('projectId') projectId: string) {
    return this.worldService.findAllByProject(projectId);
  }

  // 获取单个世界观设定
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.worldService.findOne(id);
  }

  // 更新世界观设定
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorldDto) {
    return this.worldService.update(id, dto);
  }

  // 删除世界观设定
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.worldService.remove(id);
  }
}