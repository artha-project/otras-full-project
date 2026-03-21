import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MockTestService } from './mock-test.service';

@Controller('mock-test')
export class MockTestController {
  constructor(private readonly mockTestService: MockTestService) {}

  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    return this.mockTestService.findAll(categoryId ? +categoryId : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Post('start-attempt')
  startAttempt(@Body() dto: { otrId: string, mockTestId: number }) {
    return this.mockTestService.startAttempt(dto.otrId, dto.mockTestId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('attempts')
  submitAttempt(@Body() dto: { otrId: string, mockTestId: number, score: number, totalMarks: number }) {
    return this.mockTestService.submitAttempt(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('exam-attempts')
  submitExamAttempt(@Body() dto: { otrId: string, examId: number, score: number, totalMarks: number, attemptId?: number, correctAnswers?: number, subjectBreakdown?: any }) {
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
