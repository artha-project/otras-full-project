import { Injectable } from '@nestjs/common';
import { AiService } from '../../ai/ai.service';
import { reportPrompt } from './report.prompt';

@Injectable()
export class ReportService {
  constructor(private readonly aiService: AiService) {}

  async generate(payload: any) {
    return this.aiService.generate(reportPrompt, payload);
  }
}
