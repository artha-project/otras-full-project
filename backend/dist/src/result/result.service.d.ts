import { PrismaService } from '../prisma/prisma.service';
export declare class ResultService {
    private prisma;
    constructor(prisma: PrismaService);
    startTest(userId: number, testId: number, tier?: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        tier: number | null;
        score: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        startTime: Date | null;
        submitTime: Date | null;
        testId: number;
    }>;
    calculateAndSave(userId: number, testId: number, answers: any[], tier?: number, resultId?: number): Promise<any>;
    getUserResults(userId: number): Promise<({
        test: {
            id: number;
            createdAt: Date;
            name: string;
            examId: number;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        tier: number | null;
        score: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        startTime: Date | null;
        submitTime: Date | null;
        testId: number;
    })[]>;
}
