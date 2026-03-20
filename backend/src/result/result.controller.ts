import { Controller, Post, Body, Get, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ResultService } from './result.service';

@Controller('results')
export class ResultController {
    constructor(private readonly resultService: ResultService) { }

    @Post('start')
    async start(@Body() body: { userId: number, testId: number, tier?: number }) {
        return this.resultService.startTest(body.userId, body.testId, body.tier);
    }

    @Post()
    async submit(@Body() body: { userId: number, testId: number, answers: any[], tier?: number, resultId?: number }) {
        // In a real app, userId should come from JWT
        return this.resultService.calculateAndSave(body.userId, body.testId, body.answers, body.tier, body.resultId);
    }

    @Get('user/:userId')
    async getUserResults(@Param('userId', ParseIntPipe) userId: number) {
        return this.resultService.getUserResults(userId);
    }
}
