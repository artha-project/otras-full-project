import { Controller, Get, Param, ParseIntPipe, NotFoundException, Patch, Delete, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ResultService } from '../result/result.service';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly resultService: ResultService,
    ) { }

    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Get(':id/dashboard')
    async getDashboardData(@Param('id', ParseIntPipe) id: number) {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const results = await this.resultService.getUserResults(id);

        // Prefer ARTHA percentile as the Career Index if available
        const arthaProfile = await this.userService.getArthaProfile(id.toString());
        let readinessIndex = 0;
        if (arthaProfile && arthaProfile.percentile > 0) {
            readinessIndex = Math.round(arthaProfile.percentile);
        } else {
            // Fallback: score-based calculation
            const latestResult = results[0] as any;
            const totalQs = latestResult?.test?.questions?.length || 1;
            const latestScore = latestResult ? (latestResult.score / totalQs) * 100 : 0;
            readinessIndex = Math.min(Math.round(latestScore), 100);
        }

        return {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                otrId: user.otrId,
                email: user.email,
            },
            stats: {
                readinessIndex,
                testsCompleted: results.length,
                recentTend: results.slice(0, 5).map(r => r.score),
                percentile: arthaProfile?.percentile || 0,
                logicalScore: arthaProfile?.logicalScore || 0,
                quantScore: arthaProfile?.quantScore || 0,
                verbalScore: arthaProfile?.verbalScore || 0,
            },
            recentResults: results.slice(0, 3)
        };
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.userService.update(id, data);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }

    @Get(':id/tier-status')
    async getTierStatus(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getTierStatus(id);
    }
}
