import { Injectable } from '@nestjs/common'

export interface AiWriteDto {
  content: string
  type: 'continue' | 'polish' | 'expand' | 'summarize' | 'dialogue'
  length?: number
  character?: string
}

@Injectable()
export class AiService {
  // AI写作功能（模拟实现）
  async write(dto: AiWriteDto): Promise<{ result: string }> {
    const { content, type, length = 200, character } = dto

    // 模拟AI处理结果
    let result = ''

    switch (type) {
      case 'continue':
        result = this.generateContinue(content, length)
        break
      case 'polish':
        result = this.generatePolish(content)
        break
      case 'expand':
        result = this.generateExpand(content, length)
        break
      case 'summarize':
        result = this.generateSummarize(content)
        break
      case 'dialogue':
        result = this.generateDialogue(content, character || '角色')
        break
    }

    return { result }
  }

  private generateContinue(content: string, length: number): string {
    const continuations = [
      '阳光透过树叶的缝隙洒在地上，形成斑驳的光影。主角深吸一口气，感受着清晨新鲜的空气。',
      '就在这时，一个意外的声音打破了沉默。回头望去，只见一道熟悉的身影正朝这边走来。',
      '突然，天空中划过一道闪电，预示着即将到来的风暴。山雨欲来风满楼，气氛变得愈发紧张。',
      '经过一番激烈的思想斗争，他终于做出了决定。无论前方有多少困难，都要勇往直前。'
    ]
    const random = continuations[Math.floor(Math.random() * continuations.length)]
    return content + '\n\n' + random.substring(0, length)
  }

  private generatePolish(content: string): string {
    // 简单的润色模拟
    return content
      .replace(/非常/g, '极其')
      .replace(/很/g, '十分')
      .replace(/开始/g, '着手')
      .replace(/看/g, '凝视')
  }

  private generateExpand(content: string, length: number): string {
    const expansions = [
      '详细描写了周围的环境：远处的山峦连绵起伏，近处的溪流潺潺流淌，一切都显得那么宁静而美好。',
      '他的内心活动十分复杂：既期待又紧张，既兴奋又担忧。种种情绪交织在一起，让他一时难以平静。',
      '此时的气氛变得微妙起来。两人之间的对话看似平常，实则暗藏玄机。每一个眼神、每一个动作都有深意。'
    ]
    const random = expansions[Math.floor(Math.random() * expansions.length)]
    return content + '\n\n' + random
  }

  private generateSummarize(content: string): string {
    // 简单的摘要提取
    const sentences = content.split(/[。！？]/).filter(s => s.trim())
    if (sentences.length <= 3) return content
    return sentences.slice(0, 2).join('。') + '。'
  }

  private generateDialogue(content: string, character: string): string {
    const dialogues = [
      `${character}：“我们必须尽快离开这里。”`,
      `${character}：“你真的想清楚了吗？这可是一条不归路。”`,
      `${character}：“不管理由是什么，我都不会放弃希望。”`,
      `${character}：“也许，这就是命运的安排吧。”`
    ]
    const random = dialogues[Math.floor(Math.random() * dialogues.length)]
    return random
  }
}