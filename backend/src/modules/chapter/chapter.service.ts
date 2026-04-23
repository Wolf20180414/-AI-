import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChapterDto, UpdateChapterDto } from './dto';

@Injectable()
export class ChapterService {
  constructor(private prisma: PrismaService) {}

  // 创建章节
  async create(outlineId: string, dto: CreateChapterDto) {
    return this.prisma.chapter.create({
      data: {
        outlineId,
        title: dto.title,
        goal: dto.goal,
        startHint: dto.startHint,
        endHint: dto.endHint,
        order: dto.order || 0,
        status: 'draft',
      },
    });
  }

  // 获取大纲的所有章节
  async findAllByOutline(outlineId: string) {
    return this.prisma.chapter.findMany({
      where: { outlineId },
      orderBy: { order: 'asc' },
    });
  }

  // 获取单个章节
  async findOne(id: string) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapter) {
      throw new NotFoundException(`章节ID ${id} 不存在`);
    }

    return chapter;
  }

  // 更新章节
  async update(id: string, dto: UpdateChapterDto) {
    await this.findOne(id);

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.goal !== undefined) data.goal = dto.goal;
    if (dto.startHint !== undefined) data.startHint = dto.startHint;
    if (dto.endHint !== undefined) data.endHint = dto.endHint;
    if (dto.content !== undefined) data.content = dto.content;
    if (dto.order !== undefined) data.order = dto.order;
    if (dto.status !== undefined) data.status = dto.status;

    return this.prisma.chapter.update({
      where: { id },
      data,
    });
  }

  // 删除章节
  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.chapter.delete({
      where: { id },
    });

    return { success: true };
  }

  // 更新章节内容
  async updateContent(id: string, content: string) {
    const wordCount = content.length;
    return this.prisma.chapter.update({
      where: { id },
      data: { content, wordCount },
    });
  }
}