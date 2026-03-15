import { MockTestService } from './mock-test.service';
export declare class MockTestController {
    private readonly mockTestService;
    constructor(mockTestService: MockTestService);
    findAll(categoryId?: string): Promise<({
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
    startAttempt(dto: {
        otrId: string;
        mockTestId: number;
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
    calculateRank(mockTestId: string, otrId: string): Promise<{
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
    findOne(id: string): Promise<({
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
}
