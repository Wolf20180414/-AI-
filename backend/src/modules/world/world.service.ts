import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorldDto, UpdateWorldDto } from './dto';

@Injectable()
export class WorldService {
  constructor(private prisma: PrismaService) {}

  // 创建世界观设定
  async create(projectId: string, dto: CreateWorldDto) {
    return this.prisma.world.create({
      data: {
        projectId,
        name: dto.name,
        category: dto.category,
        content: dto.content,
      },
    });
  }

  // 获取项目的所有世界观设定
  async findAllByProject(projectId: string) {
    return this.prisma.world.findMany({
      where: { projectId },
    });
  }

  // 获取单个世界观设定
  async findOne(id: string) {
    const world = await this.prisma.world.findUnique({
      where: { id },
    });

    if (!world) {
      throw new NotFoundException(`世界观ID ${id} 不存在`);
    }

    return world;
  }

  // 更新世界观设定
  async update(id: string, dto: UpdateWorldDto) {
    await this.findOne(id);

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.content !== undefined) data.content = dto.content;

    return this.prisma.world.update({
      where: { id },
      data,
    });
  }

  // 删除世界观设定
  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.world.delete({
      where: { id },
    });

    return { success: true };
  }
}