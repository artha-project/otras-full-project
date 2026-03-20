import { ResultService } from './result.service';
export declare class ResultController {
    private readonly resultService;
    constructor(resultService: ResultService);
    start(body: {
        userId: number;
        testId: number;
        tier?: number;
    }): Promise<{
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
    submit(body: {
        userId: number;
        testId: number;
        answers: any[];
        tier?: number;
        resultId?: number;
    }): Promise<any>;
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
