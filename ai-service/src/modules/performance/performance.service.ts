import { Injectable } from '@nestjs/common';
import { AiService } from '../../ai/ai.service';
import { performancePrompt } from './performance.prompt';

@Injectable()
export class PerformanceService {
  constructor(private readonly aiService: AiService) {}

  async generate(payload: any) {
    return this.aiService.generate(performancePrompt, payload);
  }
}
