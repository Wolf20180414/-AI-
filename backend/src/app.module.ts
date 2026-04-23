import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './modules/project/project.module';
import { OutlineModule } from './modules/outline/outline.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { CharacterModule } from './modules/character/character.module';
import { WorldModule } from './modules/world/world.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    ProjectModule,
    OutlineModule,
    ChapterModule,
    CharacterModule,
    WorldModule,
    AiModule,
  ],
})
export class AppModule {}