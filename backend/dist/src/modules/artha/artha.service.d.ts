import { ArthaRepository } from './repository/artha.repository';
import { ArthaProgressDto } from './dto/artha-progress.dto';
import { Tier3MetricsService } from './tier3-metrics.service';
export declare class ArthaService {
    private repository;
    private metricsService;
    private readonly logger;
    private readonly ML_SERVICE_URL;
    private readonly AI_SERVICE_URL;
    constructor(repository: ArthaRepository, metricsService: Tier3MetricsService);
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
    startTierAssessment(userId: string, tier: number): Promise<{
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
    recordQuestionAttempt(data: {
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
    processTier1(data: ArthaProgressDto, assessmentId?: string): Promise<{
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
    processTier2(userId: string, assessmentId?: string): Promise<{
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
    processTier3(userId: string, assessmentId?: string): Promise<{
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
    private generateAndSaveAiFeedback;
}
