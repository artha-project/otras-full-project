import { Injectable } from '@nestjs/common';
import { AiService } from '../../ai/ai.service';
import { burnoutPrompt } from './burnout.prompt';

@Injectable()
export class BurnoutService {
  constructor(private readonly aiService: AiService) {}

  async generate(payload: any) {
    return this.aiService.generate(burnoutPrompt, payload);
  }
}
