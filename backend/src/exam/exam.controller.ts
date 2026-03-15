import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ExamService } from './exam.service';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) { }

  @Post()
  create(@Body() createExamDto: any) {
    return this.examService.create(createExamDto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateData: any) {
    return this.examService.update(id, updateData);
  }

  @Get()
  findAll() {
    return this.examService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.examService.findOne(id);
  }

  @Get(':id/random-test')
  getRandomTest(@Param('id', ParseIntPipe) id: number) {
    return this.examService.getRandomTest(id);
  }

  @Get('tier/:tier')
  findByTier(@Param('tier') tier: string) {
    return this.examService.findByTier(tier);
  }
}
