import { StudyPlanRepository } from '../repository/study-plan.repository';
import { ReschedulerService } from './rescheduler.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';
export declare class StudyPlanService {
    private readonly repository;
    private readonly rescheduler;
    private readonly logger;
    constructor(repository: StudyPlanRepository, rescheduler: ReschedulerService);
    generate(dto: CreateStudyPlanDto): Promise<{
        summary: any;
        recommendations: any;
        days: ({
            activities: {
                id: string;
                description: string;
                timeSlot: string;
                focusArea: string | null;
                completed: boolean;
                missed: boolean;
                dayId: string;
            }[];
        } & {
            id: string;
            day: string;
            planId: string;
        })[];
        id: string;
        createdAt: Date;
        userId: number;
        examId: number | null;
        targetExam: string;
        examDate: Date;
        tier1Score: number | null;
        tier2Score: number | null;
        currentLevel: string;
        weakAreas: string[];
        dailyStudyHours: number;
        mockFrequency: string;
        revisionStrategy: string;
        preferredStudyTimes: string;
    }>;
    findByUserId(userId: number): Promise<({
        days: ({
            activities: {
                id: string;
                description: string;
                timeSlot: string;
                focusArea: string | null;
                completed: boolean;
                missed: boolean;
                dayId: string;
            }[];
        } & {
            id: string;
            day: string;
            planId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        userId: number;
        examId: number | null;
        targetExam: string;
        examDate: Date;
        tier1Score: number | null;
        tier2Score: number | null;
        currentLevel: string;
        weakAreas: string[];
        dailyStudyHours: number;
        mockFrequency: string;
        revisionStrategy: string;
        preferredStudyTimes: string;
    })[]>;
    findOne(id: string): Promise<({
        days: ({
            activities: {
                id: string;
                description: string;
                timeSlot: string;
                focusArea: string | null;
                completed: boolean;
                missed: boolean;
                dayId: string;
            }[];
        } & {
            id: string;
            day: string;
            planId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        userId: number;
        examId: number | null;
        targetExam: string;
        examDate: Date;
        tier1Score: number | null;
        tier2Score: number | null;
        currentLevel: string;
        weakAreas: string[];
        dailyStudyHours: number;
        mockFrequency: string;
        revisionStrategy: string;
        preferredStudyTimes: string;
    }) | null>;
    updateActivityStatus(activityId: string, userId: number, status: {
        completed?: boolean;
        missed?: boolean;
    }): Promise<{
        id: string;
        description: string;
        timeSlot: string;
        focusArea: string | null;
        completed: boolean;
        missed: boolean;
        dayId: string;
    }>;
}
