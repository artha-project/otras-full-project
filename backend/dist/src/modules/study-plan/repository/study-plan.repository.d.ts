import { PrismaService } from '../../../prisma/prisma.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';
export declare class StudyPlanRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    userExists(id: number): Promise<boolean>;
    createWithSchedule(data: CreateStudyPlanDto, weeklyPlan: any[]): Promise<{
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
    findById(id: string): Promise<({
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
    updateActivityStatus(activityId: string, status: {
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
    createActivity(dayId: string, data: {
        timeSlot: string;
        description: string;
        focusArea?: string;
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
