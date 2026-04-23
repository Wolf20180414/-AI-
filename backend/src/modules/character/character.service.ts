import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCharacterDto, UpdateCharacterDto } from './dto';

@Injectable()
export class CharacterService {
  constructor(private prisma: PrismaService) {}

  // 创建角色
  async create(projectId: string, dto: CreateCharacterDto) {
    return this.prisma.character.create({
      data: {
        projectId,
        name: dto.name,
        role: dto.role,
        appearance: dto.appearance,
        personality: dto.personality,
        background: dto.background,
        abilities: dto.abilities,
        status: 'planned',
      },
    });
  }

  // 获取项目的所有角色
  async findAllByProject(projectId: string) {
    return this.prisma.character.findMany({
      where: { projectId },
    });
  }

  // 获取单个角色
  async findOne(id: string) {
    const character = await this.prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      throw new NotFoundException(`角色ID ${id} 不存在`);
    }

    return character;
  }

  // 更新角色
  async update(id: string, dto: UpdateCharacterDto) {
    await this.findOne(id);

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.appearance !== undefined) data.appearance = dto.appearance;
    if (dto.personality !== undefined) data.personality = dto.personality;
    if (dto.background !== undefined) data.background = dto.background;
    if (dto.abilities !== undefined) data.abilities = dto.abilities;
    if (dto.status !== undefined) data.status = dto.status;

    return this.prisma.character.update({
      where: { id },
      data,
    });
  }

  // 删除角色
  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.character.delete({
      where: { id },
    });

    return { success: true };
  }
}