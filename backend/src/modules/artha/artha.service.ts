import { Injectable, Logger } from '@nestjs/common';
import { ArthaRepository } from './repository/artha.repository';
import { ArthaProgressDto } from './dto/artha-progress.dto';
import { Tier3MetricsService } from './tier3-metrics.service';

@Injectable()
export class ArthaService {
    private readonly logger = new Logger(ArthaService.name);
    private readonly ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';
    private readonly AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000/api/v1/ai';

    constructor(
        private repository: ArthaRepository,
        private metricsService: Tier3MetricsService
    ) { }

    async getStatus(userId: string) {
        console.log("ARTHA: Fetching profile for user", userId);
        const profile = await this.repository.findProfileByUserId(userId);
        const hasSubscription = await this.repository.hasActiveSubscription(userId);

        if (hasSubscription) {
            console.log("ARTHA: Tier access granted for user", userId);
        }

        if (!profile) {
            return {
                tier1: { unlocked: true, completed: false, progress: 0 },
                tier2: { 
                    unlocked: false, 
                    completed: false, 
                    progress: 0, 
                    subscriptionRequired: false  // Not yet reachable — complete T1 first
                },
                tier3: { 
                    unlocked: false, 
                    completed: false, 
                    progress: 0, 
                    subscriptionRequired: false  // Not yet reachable — complete T2 first
                },
                percentile: 0,
                logicalScore: 0,
                quantScore: 0,
                verbalScore: 0,
                feedback: null
            };
        }

        const tier1Completed = profile.tier1Progress === 100;
        const tier2Completed = profile.tier2Progress === 100;

        return {
            tier1: { unlocked: true, completed: tier1Completed, progress: profile.tier1Progress },
            tier2: { 
                unlocked: tier1Completed,            // Unlocks after T1 complete
                completed: tier2Completed, 
                progress: profile.tier2Progress,
                subscriptionRequired: tier1Completed && !tier2Completed && !hasSubscription  // Needs sub to attempt T2
            },
            tier3: { 
                unlocked: tier2Completed,            // Unlocks after T2 complete
                completed: profile.tier3Progress === 100, 
                progress: profile.tier3Progress,
                subscriptionRequired: tier2Completed && profile.tier3Progress < 100 && !hasSubscription  // Needs sub to attempt T3
            },
            percentile: profile.percentile,
            logicalScore: profile.logicalScore,
            quantScore: profile.quantScore,
            verbalScore: profile.verbalScore,
            feedback: profile.feedback
        };
    }

    async startTierAssessment(userId: string, tier: number) {
        return this.repository.startAssessment(userId, tier);
    }

    async recordQuestionAttempt(data: {
        assessmentId: string,
        questionId: number,
        selectedOption: string,
        isCorrect: boolean,
        timeTaken: number
    }) {
        await this.repository.saveQuestionAttempt(data);
        const allAttempts = await this.repository.findQuestionAttempts(data.assessmentId);
        
        const correctCount = allAttempts.filter(a => a.isCorrect).length;
        const attemptedCount = allAttempts.length;
        const totalTime = allAttempts.reduce((acc, a) => acc + a.timeTaken, 0);

        const accuracy = this.metricsService.calculateAccuracy(correctCount, attemptedCount);
        const speed = this.metricsService.calculateSpeed(totalTime, attemptedCount);
        const consistency = this.metricsService.calculateConsistency(allAttempts);

        return {
            accuracy: Math.round(accuracy),
            speed: parseFloat(speed.toFixed(2)),
            consistency,
            attempted: attemptedCount,
            correct: correctCount
        };
    }

    async processTier1(data: ArthaProgressDto, assessmentId?: string) {
        console.log("ARTHA: Tier-1 scores received for user", data.userId);
        const scores = [data.logicalScore, data.quantScore, data.verbalScore];
        
        // ML Percentile Calculation Integration
        let percentile = (data.logicalScore + data.quantScore + data.verbalScore) / 3; // Fallback
        
        try {
            console.log("ARTHA: Calculating percentile");
            const response = await fetch(`${this.ML_SERVICE_URL}/percentile/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scores })
            });
 
            if (response.ok) {
                const result = await response.json();
                percentile = result.percentile;
                console.log("ARTHA: Percentile calculated:", percentile);
            } else {
                this.logger.error(`ARTHA: ML Service returned error: ${response.statusText}`);
            }
        } catch (error) {
            this.logger.error('ARTHA: Failed to call ML service, using fallback calculation', error);
        }
 
        console.log("ARTHA: Saving scores to database");
        const profile = await this.repository.createOrUpdateProfile(data, percentile);
 
        // Generate or update AI Career Readiness Feedback for Tier 1
        const tier = 1;
        const inputData = {
            logicalScore: data.logicalScore,
            quantScore: data.quantScore,
            verbalScore: data.verbalScore,
            percentile: percentile
        };
 
        // Save assessment data for records
        const assessmentData = {
            tier,
            logicalScore: data.logicalScore,
            quantScore: data.quantScore,
            verbalScore: data.verbalScore,
            percentile,
            accuracy: Math.round(percentile), // Using percentile as a proxy for accuracy in T1
            subjectScores: {
                logical: data.logicalScore,
                quant: data.quantScore,
                verbal: data.verbalScore
            }
        };

        if (assessmentId) {
            await this.repository.completeAssessment(assessmentId, assessmentData);
        } else {
            await this.repository.saveAssessment(profile.id, {
                ...assessmentData,
                startTime: new Date(), // Fallback
                submitTime: new Date()
            });
        }
 
        console.log("ARTHA: Sending Tier 1 data to AI service");
        const feedback = await this.generateAndSaveAiFeedback(profile, tier, inputData);
 
        const status = await this.getStatus(data.userId);
        return { ...status, feedback: feedback || status.feedback };
    }
 
    async processTier2(userId: string, assessmentId?: string) {
        console.log("ARTHA: Tier-2 completed for user", userId);
        const profile = await this.repository.updateTier2Progress(userId);
        
        // Fetch Tier 2 Data: Selected Exam and Subject results
        const selectedExam = await this.repository.findSelectedExam(userId);
        const subjectScores = await this.repository.findTier2Results(userId);
 
        const tier = 2;
        const inputData = { selectedExam, subjectScores };
 
        // Save assessment data for records
        const assessmentData = {
            tier,
            exam: selectedExam,
            subjectScores
        };

        if (assessmentId) {
            await this.repository.completeAssessment(assessmentId, assessmentData);
        } else {
            await this.repository.saveAssessment(profile.id, {
                ...assessmentData,
                startTime: new Date(),
                submitTime: new Date()
            });
        }

        console.log("ARTHA Tier2 subjects:", Object.keys(subjectScores));
        console.log("ARTHA Tier2 scores:", subjectScores);
 
        console.log("ARTHA: Sending Tier 2 data to AI service");
        await this.generateAndSaveAiFeedback(profile, tier, inputData);
 
        return this.getStatus(userId);
    }
 
    async processTier3(userId: string, assessmentId?: string) {
        console.log("ARTHA: Tier-3 completed for user", userId);
        const profile = await this.repository.updateTier3Progress(userId);
 
        let inputData: any;
        const tier = 3;

        if (assessmentId) {
            const allAttempts = await this.repository.findQuestionAttempts(assessmentId);
            const correctCount = allAttempts.filter(a => a.isCorrect).length;
            const attemptedCount = allAttempts.length;
            const totalTime = allAttempts.reduce((acc, a) => acc + a.timeTaken, 0);

            const accuracy = this.metricsService.calculateAccuracy(correctCount, attemptedCount);
            const speed = this.metricsService.calculateSpeed(totalTime, attemptedCount);
            const consistency = this.metricsService.calculateConsistency(allAttempts);

            inputData = {
                accuracy: Math.round(accuracy),
                speed: parseFloat(speed.toFixed(2)),
                consistency
            };
        } else {
            // Fallback for legacy calls
            const metrics = await this.repository.findTier3Metrics(userId);
            inputData = { 
                accuracy: metrics.accuracy,
                speed: metrics.speed,
                consistency: metrics.consistency
            };
        }
 
        // Save assessment data for records
        const assessmentData = {
            tier,
            ...inputData
        };

        if (assessmentId) {
            await this.repository.completeAssessment(assessmentId, assessmentData);
        } else {
            await this.repository.saveAssessment(profile.id, {
                ...assessmentData,
                startTime: new Date(),
                submitTime: new Date()
            });
        }

        console.log("ARTHA Tier3 metrics:", inputData);

        console.log("ARTHA: Sending Tier 3 data to AI service");
        await this.generateAndSaveAiFeedback(profile, tier, inputData);
 
        return this.getStatus(userId);
    }
 
    private async generateAndSaveAiFeedback(profile: any, tier: number, data: any) {
        try {
            console.log("ARTHA: Tier received", tier);
            console.log("ARTHA: Using AI prompt for tier", tier);
            
            const response = await fetch(`${this.AI_SERVICE_URL}/intelligence`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tier,
                    data
                })
            });
 
            if (response.ok) {
                const feedback = await response.json();
                console.log("ARTHA: AI output generated");
                console.log("ARTHA AI: Saving IntelligenceFeedback for tier", tier);
                return await this.repository.saveFeedback(profile.id, tier, feedback);
            } else {
                this.logger.error(`ARTHA: AI Service returned error: ${response.statusText}`);
                return null;
            }
        } catch (error) {
            this.logger.error('ARTHA: Failed to call AI service for assessment feedback', error);
            return null;
        }
    }
}
