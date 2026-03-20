import { Controller, Post, Body } from '@nestjs/common';
import { CareerAIService } from '../service/career-ai.service';

@Controller('career-ai')
export class CareerAIController {
  constructor(private readonly careerService: CareerAIService) {}

  @Post('generate-roadmap')
  async generate(@Body() dto: any) {
    return this.careerService.generateRoadmap(dto);
  }
}
