import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // 创建项目
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }

  // 获取项目列表
  @Get()
  findAll(@Query() query: ProjectQueryDto) {
    return this.projectService.findAll(query);
  }

  // 获取单个项目
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  // 更新项目
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectService.update(id, dto);
  }

  // 删除项目
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }

  // 获取所有题材类型
  @Get('genres/list')
  getGenres() {
    return this.projectService.getGenres();
  }
}