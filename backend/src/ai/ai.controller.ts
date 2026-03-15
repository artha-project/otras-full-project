import { Controller, Post, Body } from '@nestjs/common';
import { AiRequestDto } from './dto/ai-request.dto';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('roadmap')
  async generateRoadmap(@Body() dto: AiRequestDto) {
    return this.aiService.generate(dto);
  }
}
