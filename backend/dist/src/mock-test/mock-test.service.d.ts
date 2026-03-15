import { PrismaService } from '../prisma/prisma.service';
export declare class MockTestService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(categoryId?: number): Promise<({
        category: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        examId: number | null;
        title: string;
        duration: number;
        sectionType: string;
        isProctored: boolean;
        isAdaptive: boolean;
        categoryId: number;
    })[]>;
    findOne(id: number): Promise<({
        category: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        examId: number | null;
        title: string;
        duration: number;
        sectionType: string;
        isProctored: boolean;
        isAdaptive: boolean;
        categoryId: number;
    }) | null>;
    startAttempt(otrId: string, mockTestId: number): Promise<{
        id: number;
        otrId: string;
        score: number;
        startTime: Date | null;
        submitTime: Date | null;
        totalMarks: number;
        attemptedAt: Date;
        mockTestId: number;
    }>;
    submitAttempt(dto: {
        otrId: string;
        mockTestId: number;
        score: number;
        totalMarks: number;
    }): Promise<{
        id: number;
        otrId: string;
        score: number;
        startTime: Date | null;
        submitTime: Date | null;
        totalMarks: number;
        attemptedAt: Date;
        mockTestId: number;
    }>;
    getRecentAttempt(otrId: string): Promise<({
        mockTest: {
            category: {
                id: number;
                name: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            examId: number | null;
            title: string;
            duration: number;
            sectionType: string;
            isProctored: boolean;
            isAdaptive: boolean;
            categoryId: number;
        };
    } & {
        id: number;
        otrId: string;
        score: number;
        startTime: Date | null;
        submitTime: Date | null;
        totalMarks: number;
        attemptedAt: Date;
        mockTestId: number;
    }) | null>;
    calculateRank(mockTestId: number, otrId: string): Promise<{
        msg: string;
        total: number;
        rank?: undefined;
        topPercentage?: undefined;
        percentile?: undefined;
    } | {
        rank: number;
        total: number;
        topPercentage: number;
        percentile: number;
        msg?: undefined;
    }>;
    submitExamAttempt(dto: {
        otrId: string;
        examId: number;
        score: number;
        totalMarks: number;
        attemptId?: number;
    }): Promise<{
        id: number;
        otrId: string;
        score: number;
        startTime: Date | null;
        submitTime: Date | null;
        totalMarks: number;
        attemptedAt: Date;
        mockTestId: number;
    }>;
}
