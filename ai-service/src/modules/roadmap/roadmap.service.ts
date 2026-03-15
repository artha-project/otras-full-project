// ======================================================
// Roadmap Service
// ======================================================

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AiService } from '../../ai/ai.service';
import { roadmapPrompt } from './roadmap.prompt';

@Injectable()
export class RoadmapService {
  constructor(private readonly aiService: AiService) {}

  async generate(payload: any) {
    try {
      return await this.aiService.generate(roadmapPrompt, payload);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to generate roadmap.',
      );
    }
  }
}
