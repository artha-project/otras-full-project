import { ArthaService } from './artha.service';
import { ArthaProgressDto } from './dto/artha-progress.dto';
export declare class ArthaController {
    private service;
    constructor(service: ArthaService);
    getStatus(userId: string): Promise<{
        tier1: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
        };
        tier2: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        tier3: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        percentile: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            id: string;
            createdAt: Date;
            tier: number;
            weakAreas: string | null;
            profileId: string;
            logicalFoundation: string | null;
            subjectDepth: string | null;
            readinessInsight: string | null;
            subjectStrength: string | null;
            preparationAdvice: string | null;
            accuracyInsight: string | null;
            speedInsight: string | null;
            consistencyInsight: string | null;
        } | null;
    }>;
    startTier(body: {
        userId: string;
    }, tier: string): Promise<{
        exam: string | null;
        id: string;
        createdAt: Date;
        logicalScore: number | null;
        quantScore: number | null;
        verbalScore: number | null;
        percentile: number | null;
        tier: number;
        startTime: Date | null;
        submitTime: Date | null;
        subjectScores: import("@prisma/client/runtime/library").JsonValue | null;
        accuracy: number | null;
        speed: number | null;
        consistency: number | null;
        profileId: string;
    }>;
    completeTier1(body: ArthaProgressDto & {
        assessmentId?: string;
    }): Promise<{
        feedback: {
            id: string;
            createdAt: Date;
            tier: number;
            weakAreas: string | null;
            profileId: string;
            logicalFoundation: string | null;
            subjectDepth: string | null;
            readinessInsight: string | null;
            subjectStrength: string | null;
            preparationAdvice: string | null;
            accuracyInsight: string | null;
            speedInsight: string | null;
            consistencyInsight: string | null;
        } | null;
        tier1: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
        };
        tier2: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        tier3: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        percentile: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
    }>;
    completeTier2(body: {
        userId: string;
        assessmentId?: string;
    }): Promise<{
        tier1: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
        };
        tier2: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        tier3: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        percentile: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            id: string;
            createdAt: Date;
            tier: number;
            weakAreas: string | null;
            profileId: string;
            logicalFoundation: string | null;
            subjectDepth: string | null;
            readinessInsight: string | null;
            subjectStrength: string | null;
            preparationAdvice: string | null;
            accuracyInsight: string | null;
            speedInsight: string | null;
            consistencyInsight: string | null;
        } | null;
    }>;
    completeTier3(body: {
        userId: string;
        assessmentId?: string;
    }): Promise<{
        tier1: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
        };
        tier2: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        tier3: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        percentile: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            id: string;
            createdAt: Date;
            tier: number;
            weakAreas: string | null;
            profileId: string;
            logicalFoundation: string | null;
            subjectDepth: string | null;
            readinessInsight: string | null;
            subjectStrength: string | null;
            preparationAdvice: string | null;
            accuracyInsight: string | null;
            speedInsight: string | null;
            consistencyInsight: string | null;
        } | null;
    }>;
    attemptQuestion(body: {
        assessmentId: string;
        questionId: number;
        selectedOption: string;
        isCorrect: boolean;
        timeTaken: number;
    }): Promise<{
        accuracy: number;
        speed: number;
        consistency: number;
        attempted: number;
        correct: number;
    }>;
}
