"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StudyPlanService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlanService = void 0;
const common_1 = require("@nestjs/common");
const study_plan_repository_1 = require("../repository/study-plan.repository");
const rescheduler_service_1 = require("./rescheduler.service");
let StudyPlanService = StudyPlanService_1 = class StudyPlanService {
    repository;
    rescheduler;
    logger = new common_1.Logger(StudyPlanService_1.name);
    constructor(repository, rescheduler) {
        this.repository = repository;
        this.rescheduler = rescheduler;
    }
    async generate(dto) {
        try {
            console.log("Calling AI service with payload:", dto);
            const userExists = await this.repository.userExists(dto.userId);
            if (!userExists) {
                throw new common_1.NotFoundException(`User with ID ${dto.userId} not found.`);
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
                throw new common_1.InternalServerErrorException('AI Service failed');
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
        }
        catch (error) {
            console.error("StudyPlanService Generate Error:", error);
            throw error;
        }
    }
    async findByUserId(userId) {
        return this.repository.findByUserId(userId);
    }
    async findOne(id) {
        return this.repository.findById(id);
    }
    async updateActivityStatus(activityId, userId, status) {
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
};
exports.StudyPlanService = StudyPlanService;
exports.StudyPlanService = StudyPlanService = StudyPlanService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [study_plan_repository_1.StudyPlanRepository,
        rescheduler_service_1.ReschedulerService])
], StudyPlanService);
//# sourceMappingURL=study-plan.service.js.map