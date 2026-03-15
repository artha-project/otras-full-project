import { Injectable, Logger, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { StudyPlanRepository } from '../repository/study-plan.repository';
import { ReschedulerService } from './rescheduler.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';

@Injectable()
export class StudyPlanService {
  private readonly logger = new Logger(StudyPlanService.name);

  constructor(
    private readonly repository: StudyPlanRepository,
    private readonly rescheduler: ReschedulerService,
  ) {}

  async generate(dto: CreateStudyPlanDto) {
    try {
      console.log("Calling AI service with payload:", dto);
      
      const userExists = await this.repository.userExists(dto.userId);
      if (!userExists) {
        throw new NotFoundException(`User with ID ${dto.userId} not found.`);
      }
      
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000/api/v1';
      
      const response = await fetch(`${aiServiceUrl}/study-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI service error response:", errorText);
        throw new InternalServerErrorException('AI Service failed');
      }
      
      const aiData = await response.json();
      console.log("AI service response:", aiData);
      
      const { weeklyPlan, summary, recommendations } = aiData;
      const savedPlan = await this.repository.createWithSchedule(dto, weeklyPlan);
      
      return {
        ...savedPlan,
        summary: summary || "Generated Plan",
        recommendations: recommendations || []
      };
    } catch (error) {
      console.error("StudyPlanService Generate Error:", error);
      throw error;
    }
  }

  async findByUserId(userId: number) {
    return this.repository.findByUserId(userId);
  }

  async findOne(id: string) {
    return this.repository.findById(id);
  }

  async updateActivityStatus(activityId: string, userId: number, status: { completed?: boolean; missed?: boolean }) {
    const activity = await this.repository.updateActivityStatus(activityId, status);
    if (status.missed) {
      await this.rescheduler.storeMissedTask(userId, activity);
      const plans = await this.repository.findByUserId(userId);
      if (plans.length > 0) {
        const currentPlan = plans[0];
        const lastDay = currentPlan.days[currentPlan.days.length - 1];
        await this.repository.createActivity(lastDay.id, {
          timeSlot: 'Makeup Session',
          description: `MISSED: ${activity.description}`,
          focusArea: activity.focusArea ?? undefined
        });
      }
    }
    return activity;
  }
}