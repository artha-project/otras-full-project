import { Controller, Post, Body, Get, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { StudyPlanService } from '../service/study-plan.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';

@Controller('study-plan')
export class StudyPlanController {
  constructor(private readonly studyPlanService: StudyPlanService) {}

  @Post('generate')
  async generate(@Body() dto: CreateStudyPlanDto) {
    console.log("Received StudyPlan request:", dto);
    return this.studyPlanService.generate(dto);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.studyPlanService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studyPlanService.findOne(id);
  }

  @Patch('activity/:activityId')
  async updateActivity(
    @Param('activityId') activityId: string,
    @Body('userId', ParseIntPipe) userId: number,
    @Body() status: { completed?: boolean; missed?: boolean }
  ) {
    return this.studyPlanService.updateActivityStatus(activityId, userId, status);
  }
}