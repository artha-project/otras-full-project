import { Controller, Post, Body } from '@nestjs/common';
import { CareerAiService } from './career-ai.service';

@Controller('career-ai')
export class CareerAiController {
  constructor(private readonly service: CareerAiService) {}

  @Post()
  async generate(@Body() dto: any) {
    return this.service.generate(dto);
  }
}
