import { UserService } from './user.service';
import { ResultService } from '../result/result.service';
export declare class UserController {
    private readonly userService;
    private readonly resultService;
    constructor(userService: UserService, resultService: ResultService);
    findAll(): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        age: number | null;
        category: string | null;
        otrId: string;
        highestDegree: string | null;
        careerPreference: string | null;
        domicile: string | null;
        pincode: string | null;
        createdAt: Date;
        updatedAt: Date;
        credits: number;
        referralCode: string;
        preferredLanguage: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        age: number | null;
        category: string | null;
        otrId: string;
        highestDegree: string | null;
        careerPreference: string | null;
        domicile: string | null;
        pincode: string | null;
        createdAt: Date;
        updatedAt: Date;
        credits: number;
        referralCode: string;
        preferredLanguage: string;
    } | null>;
    getDashboardData(id: number): Promise<{
        user: {
            firstName: string;
            lastName: string;
            otrId: string;
            email: string;
        };
        stats: {
            readinessIndex: number;
            testsCompleted: number;
            recentTend: number[];
            percentile: number;
            logicalScore: number;
            quantScore: number;
            verbalScore: number;
        };
        recentResults: ({
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
        })[];
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        age: number | null;
        category: string | null;
        otrId: string;
        highestDegree: string | null;
        careerPreference: string | null;
        domicile: string | null;
        pincode: string | null;
        createdAt: Date;
        updatedAt: Date;
        credits: number;
        referralCode: string;
        preferredLanguage: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        age: number | null;
        category: string | null;
        otrId: string;
        highestDegree: string | null;
        careerPreference: string | null;
        domicile: string | null;
        pincode: string | null;
        createdAt: Date;
        updatedAt: Date;
        credits: number;
        referralCode: string;
        preferredLanguage: string;
    }>;
    getTierStatus(id: number): Promise<{
        tier1: {
            unlocked: boolean;
            completed: boolean;
        };
        tier2: {
            unlocked: boolean;
            completed: boolean;
            subscriptionRequired: boolean;
            subscriptionExpired: boolean;
        };
        tier3: {
            unlocked: boolean;
            completed: boolean;
            subscriptionRequired: boolean;
            subscriptionExpired: boolean;
        };
        hasActiveSubscription: boolean;
        hasExpiredSubscription: boolean;
    }>;
}
