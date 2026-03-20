import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { ArthaService } from './artha.service'

import { ArthaProgressDto } from './dto/artha-progress.dto'

@Controller("artha")
export class ArthaController {

    constructor(private service: ArthaService) { }

    @Get("status/:userId")
    async getStatus(@Param("userId") userId: string) {
        return this.service.getStatus(userId)
    }

    @Post("start-tier/:tier")
    async startTier(@Body() body: { userId: string }, @Param("tier") tier: string) {
        return this.service.startTierAssessment(body.userId, parseInt(tier, 10))
    }

    @Post("tier1")
    async completeTier1(@Body() body: ArthaProgressDto & { assessmentId?: string }) {
        return this.service.processTier1(body, body.assessmentId)
    }

    @Post("tier2")
    async completeTier2(@Body() body: { userId: string, assessmentId?: string, language?: string, attemptedCount?: number, totalQuestions?: number }) {
        return this.service.processTier2(body.userId, body.assessmentId, body.language, body.attemptedCount, body.totalQuestions)
    }

    @Post("tier3")
    async completeTier3(@Body() body: { userId: string, assessmentId?: string, language?: string, attemptedCount?: number, totalQuestions?: number }) {
        return this.service.processTier3(body.userId, body.assessmentId, body.language, body.attemptedCount, body.totalQuestions)
    }

    @Post("attempt-question")
    async attemptQuestion(@Body() body: {
        assessmentId: string,
        questionId: number,
        selectedOption: string,
        isCorrect: boolean,
        timeTaken: number
    }) {
        return this.service.recordQuestionAttempt(body);
    }

    @Get("recent-reports/:userId")
    async getRecentReports(@Param("userId") userId: string) {
        return this.service.getStatus(userId); // getStatus now includes recentReports
    }
}