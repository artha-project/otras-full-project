import { Module } from '@nestjs/common';
import { CareerAIController } from './controller/career-ai.controller';
import { CareerAIService } from './service/career-ai.service';

@Module({
  controllers: [CareerAIController],
  providers: [CareerAIService],
  exports: [CareerAIService],
})
export class CareerAIModule {}
