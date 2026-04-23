import { Controller, Post, Body } from '@nestjs/common'
import { AiService, AiWriteDto } from './ai.service'

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('write')
  async write(@Body() dto: AiWriteDto) {
    return this.aiService.write(dto)
  }
}