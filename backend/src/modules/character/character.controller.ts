import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto, UpdateCharacterDto } from './dto';

@Controller('projects/:projectId/characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  // 创建角色
  @Post()
  create(@Param('projectId') projectId: string, @Body() dto: CreateCharacterDto) {
    return this.characterService.create(projectId, dto);
  }

  // 获取所有角色
  @Get()
  findAll(@Param('projectId') projectId: string) {
    return this.characterService.findAllByProject(projectId);
  }

  // 获取单个角色
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.characterService.findOne(id);
  }

  // 更新角色
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCharacterDto) {
    return this.characterService.update(id, dto);
  }

  // 删除角色
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.characterService.remove(id);
  }
}