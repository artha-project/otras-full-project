import { Injectable } from '@nestjs/common';
import { AiService } from '../../ai/ai.service';
import { careerPrompt } from './career.prompt';

@Injectable()
export class CareerService {
  constructor(private readonly aiService: AiService) {}

  async generate(payload: any) {
    return this.aiService.generate(careerPrompt, payload);
  }
}
