import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  // 创建项目
  async create(dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        title: dto.title,
        genre: dto.genre,
        synopsis: dto.synopsis,
        targetWordCount: dto.targetWordCount || 100000,
        currentWordCount: 0,
        status: 'DRAFT',
      },
    });
  }

  // 获取项目列表
  async findAll(query: ProjectQueryDto) {
    const { search, status, genre, page = 1, pageSize = 10 } = query;
    
    const where: any = {};
    
    // 搜索条件
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { synopsis: { contains: search } },
      ];
    }
    
    // 状态筛选
    if (status) {
      where.status = status;
    }
    
    // 题材筛选
    if (genre) {
      where.genre = genre;
    }

    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip: (page - 1) * Number(pageSize),
        take: Number(pageSize),
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // 获取单个项目
  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            outlines: true,
            characters: true,
            worlds: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`项目ID ${id} 不存在`);
    }

    return project;
  }

  // 更新项目
  async update(id: string, dto: UpdateProjectDto) {
    // 检查项目是否存在
    await this.findOne(id);

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.genre !== undefined) data.genre = dto.genre;
    if (dto.synopsis !== undefined) data.synopsis = dto.synopsis;
    if (dto.targetWordCount !== undefined) data.targetWordCount = dto.targetWordCount;
    if (dto.status !== undefined) data.status = dto.status;

    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  // 删除项目
  async remove(id: string) {
    // 检查项目是否存在
    await this.findOne(id);

    await this.prisma.project.delete({
      where: { id },
    });

    return { success: true };
  }

  // 更新项目字数
  async updateWordCount(id: string, wordCount: number) {
    return this.prisma.project.update({
      where: { id },
      data: { currentWordCount: wordCount },
    });
  }

  // 获取所有题材类型
  async getGenres() {
    const projects = await this.prisma.project.findMany({
      select: { genre: true },
      distinct: ['genre'],
    });
    return projects.map(p => p.genre);
  }
}