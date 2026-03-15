"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ArthaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArthaService = void 0;
const common_1 = require("@nestjs/common");
const artha_repository_1 = require("./repository/artha.repository");
const tier3_metrics_service_1 = require("./tier3-metrics.service");
let ArthaService = ArthaService_1 = class ArthaService {
    repository;
    metricsService;
    logger = new common_1.Logger(ArthaService_1.name);
    ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';
    AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000/api/v1/ai';
    constructor(repository, metricsService) {
        this.repository = repository;
        this.metricsService = metricsService;
    }
    async getStatus(userId) {
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
                    subscriptionRequired: false
                },
                tier3: {
                    unlocked: false,
                    completed: false,
                    progress: 0,
                    subscriptionRequired: false
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
                unlocked: tier1Completed,
                completed: tier2Completed,
                progress: profile.tier2Progress,
                subscriptionRequired: tier1Completed && !tier2Completed && !hasSubscription
            },
            tier3: {
                unlocked: tier2Completed,
                completed: profile.tier3Progress === 100,
                progress: profile.tier3Progress,
                subscriptionRequired: tier2Completed && profile.tier3Progress < 100 && !hasSubscription
            },
            percentile: profile.percentile,
            logicalScore: profile.logicalScore,
            quantScore: profile.quantScore,
            verbalScore: profile.verbalScore,
            feedback: profile.feedback
        };
    }
    async startTierAssessment(userId, tier) {
        return this.repository.startAssessment(userId, tier);
    }
    async recordQuestionAttempt(data) {
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
    async processTier1(data, assessmentId) {
        console.log("ARTHA: Tier-1 scores received for user", data.userId);
        const scores = [data.logicalScore, data.quantScore, data.verbalScore];
        let percentile = (data.logicalScore + data.quantScore + data.verbalScore) / 3;
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
            }
            else {
                this.logger.error(`ARTHA: ML Service returned error: ${response.statusText}`);
            }
        }
        catch (error) {
            this.logger.error('ARTHA: Failed to call ML service, using fallback calculation', error);
        }
        console.log("ARTHA: Saving scores to database");
        const profile = await this.repository.createOrUpdateProfile(data, percentile);
        const tier = 1;
        const inputData = {
            logicalScore: data.logicalScore,
            quantScore: data.quantScore,
            verbalScore: data.verbalScore,
            percentile: percentile
        };
        const assessmentData = {
            tier,
            logicalScore: data.logicalScore,
            quantScore: data.quantScore,
            verbalScore: data.verbalScore,
            percentile,
            accuracy: Math.round(percentile),
            subjectScores: {
                logical: data.logicalScore,
                quant: data.quantScore,
                verbal: data.verbalScore
            }
        };
        if (assessmentId) {
            await this.repository.completeAssessment(assessmentId, assessmentData);
        }
        else {
            await this.repository.saveAssessment(profile.id, {
                ...assessmentData,
                startTime: new Date(),
                submitTime: new Date()
            });
        }
        console.log("ARTHA: Sending Tier 1 data to AI service");
        const feedback = await this.generateAndSaveAiFeedback(profile, tier, inputData);
        const status = await this.getStatus(data.userId);
        return { ...status, feedback: feedback || status.feedback };
    }
    async processTier2(userId, assessmentId) {
        console.log("ARTHA: Tier-2 completed for user", userId);
        const profile = await this.repository.updateTier2Progress(userId);
        const selectedExam = await this.repository.findSelectedExam(userId);
        const subjectScores = await this.repository.findTier2Results(userId);
        const tier = 2;
        const inputData = { selectedExam, subjectScores };
        const assessmentData = {
            tier,
            exam: selectedExam,
            subjectScores
        };
        if (assessmentId) {
            await this.repository.completeAssessment(assessmentId, assessmentData);
        }
        else {
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
    async processTier3(userId, assessmentId) {
        console.log("ARTHA: Tier-3 completed for user", userId);
        const profile = await this.repository.updateTier3Progress(userId);
        let inputData;
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
        }
        else {
            const metrics = await this.repository.findTier3Metrics(userId);
            inputData = {
                accuracy: metrics.accuracy,
                speed: metrics.speed,
                consistency: metrics.consistency
            };
        }
        const assessmentData = {
            tier,
            ...inputData
        };
        if (assessmentId) {
            await this.repository.completeAssessment(assessmentId, assessmentData);
        }
        else {
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
    async generateAndSaveAiFeedback(profile, tier, data) {
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
            }
            else {
                this.logger.error(`ARTHA: AI Service returned error: ${response.statusText}`);
                return null;
            }
        }
        catch (error) {
            this.logger.error('ARTHA: Failed to call AI service for assessment feedback', error);
            return null;
        }
    }
};
exports.ArthaService = ArthaService;
exports.ArthaService = ArthaService = ArthaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [artha_repository_1.ArthaRepository,
        tier3_metrics_service_1.Tier3MetricsService])
], ArthaService);
//# sourceMappingURL=artha.service.js.map