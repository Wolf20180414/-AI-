import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto, UpdateChapterDto } from './dto';

@Controller('outlines/:outlineId/chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  // 创建章节
  @Post()
  create(@Param('outlineId') outlineId: string, @Body() dto: CreateChapterDto) {
    return this.chapterService.create(outlineId, dto);
  }

  // 获取所有章节
  @Get()
  findAll(@Param('outlineId') outlineId: string) {
    return this.chapterService.findAllByOutline(outlineId);
  }

  // 获取单个章节
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chapterService.findOne(id);
  }

  // 更新章节
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChapterDto) {
    return this.chapterService.update(id, dto);
  }

  // 删除章节
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chapterService.remove(id);
  }

  // 更新章节内容
  @Put(':id/content')
  updateContent(@Param('id') id: string, @Body() body: { content: string }) {
    return this.chapterService.updateContent(id, body.content);
  }
}