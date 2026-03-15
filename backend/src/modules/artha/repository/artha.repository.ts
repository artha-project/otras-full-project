import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ArthaProgressDto } from '../dto/artha-progress.dto';

@Injectable()
export class ArthaRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findProfileByUserId(userId: string) {
        return this.prisma.arthaProfile.findFirst({
            where: { userId: userId.toString() },
            include: { feedback: true }
        });
    }

    async findSelectedExam(userId: string) {
        const application = await this.prisma.application.findFirst({
            where: { userId: Number(userId) },
            include: { exam: true },
            orderBy: { createdAt: 'desc' }
        });
        return application?.exam?.name || 'General Competitive Exam';
    }

    async findTier2Results(userId: string) {
        const result = await this.prisma.result.findFirst({
            where: { userId: Number(userId), tier: 2 },
            orderBy: { createdAt: 'desc' }
        });
        
        if (!result || typeof result.subjectBreakdown !== 'object') return {};
        
        const breakdown = result.subjectBreakdown as any;
        const scores: any = {};
        Object.keys(breakdown).forEach(sub => {
            scores[sub] = breakdown[sub].score || 0;
        });
        return scores;
    }

    async findTier3Metrics(userId: string) {
        const result = await this.prisma.result.findFirst({
            where: { userId: Number(userId), tier: 3 },
            orderBy: { createdAt: 'desc' }
        });
        
        if (!result || typeof result.subjectBreakdown !== 'object') {
            return { accuracy: 75, speed: 45, consistency: 70 };
        }

        const breakdown = result.subjectBreakdown as any;
        let correctCount = 0;
        let attemptedCount = 0;
        const sectionAccuracies: number[] = [];
        
        Object.values(breakdown).forEach((s: any) => {
            const correct = (s.correct || 0);
            const wrong = (s.wrong || 0);
            const attempted = correct + wrong;
            
            correctCount += correct;
            attemptedCount += attempted;
            
            if (attempted > 0) {
                sectionAccuracies.push((correct / attempted) * 100);
            }
        });

        // 1. Calculate real exam duration
        const res = result as any;
        const examStartTime = res.startTime ? new Date(res.startTime).getTime() : 0;
        const examSubmitTime = res.submitTime ? new Date(res.submitTime).getTime() : 0;
        let examDurationSeconds = 0;
        
        if (examStartTime > 0 && examSubmitTime > 0) {
            examDurationSeconds = Math.max(0, (examSubmitTime - examStartTime) / 1000);
        } else {
            // Fallback to 30 mins if timestamps missing
            examDurationSeconds = 1800;
        }

        // 2. Accuracy: (correctAnswers / attemptedQuestions) * 100
        const accuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;
        
        // 3. Speed: examDurationSeconds / attemptedQuestions (in seconds per question)
        const speedSecondsPerQuestion = attemptedCount > 0 ? (examDurationSeconds / attemptedCount) : 0;

        // 4. Consistency: Stability across sections (Inverse of normalized standard deviation)
        let consistency = 70;
        if (sectionAccuracies.length > 1) {
            const mean = sectionAccuracies.reduce((a, b) => a + b, 0) / sectionAccuracies.length;
            const variance = sectionAccuracies.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sectionAccuracies.length;
            const stdDev = Math.sqrt(variance);
            // Normalized consistency: 100 minus double standard deviation, clamped
            consistency = Math.max(0, Math.min(100, 100 - (stdDev * 1.5)));
        } else if (sectionAccuracies.length === 1) {
            consistency = 100;
        }

        return {
            accuracy: Math.round(accuracy),
            speed: parseFloat(speedSecondsPerQuestion.toFixed(2)), // Stored in seconds per question
            consistency: Math.round(consistency)
        };
    }
 
    async saveAssessment(profileId: string, data: { 
        tier: number, 
        exam?: string, 
        logicalScore?: number,
        quantScore?: number,
        verbalScore?: number,
        subjectScores?: any, 
        accuracy?: number, 
        speed?: number, 
        consistency?: number,
        percentile?: number,
        startTime?: Date,
        submitTime?: Date
    }) {
        return this.prisma.arthaAssessment.create({
            data: {
                profileId,
                tier: data.tier,
                exam: data.exam,
                logicalScore: data.logicalScore,
                quantScore: data.quantScore,
                verbalScore: data.verbalScore,
                subjectScores: data.subjectScores,
                accuracy: data.accuracy,
                speed: data.speed,
                consistency: data.consistency,
                percentile: data.percentile,
                startTime: data.startTime,
                submitTime: data.submitTime
            }
        });
    }

    async startAssessment(userId: string, tier: number) {
        let profile = await this.findProfileByUserId(userId);
        if (!profile) {
            // Need a profile to link the assessment
            profile = await this.prisma.arthaProfile.create({
                data: {
                    userId: userId.toString(),
                    logicalScore: 0,
                    quantScore: 0,
                    verbalScore: 0,
                    percentile: 0,
                    tier1Progress: 0,
                    tier2Progress: 0,
                    tier3Progress: 0,
                    otrCompleted: false
                },
                include: { feedback: true }
            });
        }

        return this.prisma.arthaAssessment.create({
            data: {
                profileId: profile.id,
                tier,
                startTime: new Date(),
            }
        });
    }

    async completeAssessment(assessmentId: string, data: any) {
        return this.prisma.arthaAssessment.update({
            where: { id: assessmentId },
            data: {
                ...data,
                submitTime: new Date()
            }
        });
    }

    async saveQuestionAttempt(data: {
        assessmentId: string,
        questionId: number,
        selectedOption: string,
        isCorrect: boolean,
        timeTaken: number
    }) {
        return this.prisma.arthaQuestionAttempt.create({
            data: {
                assessmentId: data.assessmentId,
                questionId: data.questionId,
                selectedOption: data.selectedOption,
                isCorrect: data.isCorrect,
                timeTaken: data.timeTaken
            }
        });
    }

    async findQuestionAttempts(assessmentId: string) {
        return this.prisma.arthaQuestionAttempt.findMany({
            where: { assessmentId },
            orderBy: { attemptedAt: 'asc' }
        });
    }

    async hasActiveSubscription(userId: string | number) {
        console.log("ARTHA: Checking subscription for user", userId);
        const payment = await this.prisma.payment.findFirst({
            where: {
                userId: Number(userId),
                status: 'paid'
            },
            include: { subscription: true }
        });

        if (payment) {
            console.log("ARTHA: Active subscription found", payment.subscription);
            return true;
        }
        
        console.log("ARTHA: Subscription required for tier");
        return false;
    }

    async createOrUpdateProfile(data: any, percentile: number) {
        const existing = await this.findProfileByUserId(data.userId);

        if (existing) {
            return this.prisma.arthaProfile.update({
                where: { id: existing.id },
                data: {
                    logicalScore: data.logicalScore,
                    quantScore: data.quantScore,
                    verbalScore: data.verbalScore,
                    percentile,
                    tier1Progress: 100,
                    // Ensure the core fields are updated
                    otrCompleted: true
                },
                include: { feedback: true }
            });
        }

        return this.prisma.arthaProfile.create({
            data: {
                userId: data.userId.toString(),
                logicalScore: data.logicalScore,
                quantScore: data.quantScore,
                verbalScore: data.verbalScore,
                percentile,
                tier1Progress: 100,
                tier2Progress: 0,
                tier3Progress: 0,
                otrCompleted: true
            },
            include: { feedback: true }
        });
    }

    async updateTier2Progress(userId: string) {
        const profile = await this.findProfileByUserId(userId);
        if (!profile) throw new Error("Artha Profile not found");
        if (profile.tier1Progress < 100) throw new Error("Tier 1 must be completed first");

        return this.prisma.arthaProfile.update({
            where: { id: profile.id },
            data: { tier2Progress: 100 }
        });
    }

    async updateTier3Progress(userId: string) {
        const profile = await this.findProfileByUserId(userId);
        if (!profile) throw new Error("Artha Profile not found");

        return this.prisma.arthaProfile.update({
            where: { id: profile.id },
            data: { tier3Progress: 100 }
        });
    }

    async saveFeedback(profileId: string, tier: number, feedback: any) {
        return this.prisma.intelligenceFeedback.upsert({
            where: { profileId },
            update: {
                ...feedback,
                tier
            },
            create: {
                profileId,
                tier,
                ...feedback
            }
        });
    }
}