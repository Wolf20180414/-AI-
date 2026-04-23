import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOutlineDto, UpdateOutlineDto } from './dto';

@Injectable()
export class OutlineService {
  constructor(private prisma: PrismaService) {}

  // 创建大纲（卷）
  async create(projectId: string, dto: CreateOutlineDto) {
    return this.prisma.outline.create({
      data: {
        projectId,
        title: dto.title,
        summary: dto.summary,
        order: dto.order || 0,
      },
    });
  }

  // 获取项目的所有大纲
  async findAllByProject(projectId: string) {
    return this.prisma.outline.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  // 获取单个大纲
  async findOne(id: string) {
    const outline = await this.prisma.outline.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!outline) {
      throw new NotFoundException(`大纲ID ${id} 不存在`);
    }

    return outline;
  }

  // 更新大纲
  async update(id: string, dto: UpdateOutlineDto) {
    await this.findOne(id);

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.summary !== undefined) data.summary = dto.summary;
    if (dto.order !== undefined) data.order = dto.order;

    return this.prisma.outline.update({
      where: { id },
      data,
    });
  }

  // 删除大纲
  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.outline.delete({
      where: { id },
    });

    return { success: true };
  }

  // 批量创建大纲
  async createMany(projectId: string, outlines: CreateOutlineDto[]) {
    const data = outlines.map((o, index) => ({
      projectId,
      title: o.title,
      summary: o.summary,
      order: o.order ?? index,
    }));

    return this.prisma.outline.createMany({
      data,
    });
  }
}