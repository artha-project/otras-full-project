import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MockTestService } from './mock-test.service';

@Controller('mock-test')
export class MockTestController {
  constructor(private readonly mockTestService: MockTestService) {}

  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    return this.mockTestService.findAll(categoryId ? +categoryId : undefined);
  }

  @Post('start-attempt')
  startAttempt(@Body() dto: { otrId: string, mockTestId: number }) {
    return this.mockTestService.startAttempt(dto.otrId, dto.mockTestId);
  }

  @Post('attempts')
  submitAttempt(@Body() dto: { otrId: string, mockTestId: number, score: number, totalMarks: number }) {
    return this.mockTestService.submitAttempt(dto);
  }

  @Post('exam-attempts')
  submitExamAttempt(@Body() dto: { otrId: string, examId: number, score: number, totalMarks: number, attemptId?: number }) {
    return this.mockTestService.submitExamAttempt(dto);
  }

  @Get('attempts/recent/:otrId')
  getRecentAttempt(@Param('otrId') otrId: string) {
    return this.mockTestService.getRecentAttempt(otrId);
  }

  @Get('rank/:mockTestId/:otrId')
  calculateRank(
    @Param('mockTestId') mockTestId: string,
    @Param('otrId') otrId: string
  ) {
    return this.mockTestService.calculateRank(+mockTestId, otrId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mockTestService.findOne(+id);
  }
}
