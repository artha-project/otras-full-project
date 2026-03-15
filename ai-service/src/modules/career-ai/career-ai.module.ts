import { Module } from '@nestjs/common';
import { CareerAiController } from './career-ai.controller';
import { CareerAiService } from './career-ai.service';
import { AiModule } from '../../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [CareerAiController],
  providers: [CareerAiService],
  exports: [CareerAiService],
})
export class CareerAiModule {}
