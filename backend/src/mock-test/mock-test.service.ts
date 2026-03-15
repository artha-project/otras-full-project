import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MockTestService {
  private readonly logger = new Logger(MockTestService.name);
  constructor(private prisma: PrismaService) {}

  async findAll(categoryId?: number) {
    return this.prisma.mockTest.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { category: true },
      take: 50
    });
  }

  async findOne(id: number) {
    return this.prisma.mockTest.findUnique({
      where: { id },
      include: { category: true }
    });
  }

  async startAttempt(otrId: string, mockTestId: number) {
    const user = await this.prisma.user.findUnique({ where: { otrId } });
    if (!user) throw new NotFoundException('User with this OTR ID not found');

    return this.prisma.mockTestAttempt.create({
        data: {
            otrId,
            mockTestId,
            score: 0,
            totalMarks: 0,
            startTime: new Date()
        }
    });
  }

  async submitAttempt(dto: { otrId: string, mockTestId: number, score: number, totalMarks: number }) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { otrId: dto.otrId }});
    if (!user) throw new NotFoundException('User with this OTR ID not found');

    return this.prisma.mockTestAttempt.create({
      data: {
        otrId: dto.otrId,
        mockTestId: dto.mockTestId,
        score: dto.score,
        totalMarks: dto.totalMarks,
      }
    });
  }

  async getRecentAttempt(otrId: string) {
    return this.prisma.mockTestAttempt.findFirst({
      where: { otrId },
      orderBy: { attemptedAt: 'desc' },
      include: { mockTest: { include: { category: true } } }
    });
  }

  async calculateRank(mockTestId: number, otrId: string) {
    const userAttempt = await this.prisma.mockTestAttempt.findFirst({
      where: { mockTestId, otrId },
      orderBy: { score: 'desc' }
    });

    if (!userAttempt) {
       const total = await this.prisma.mockTestAttempt.count({ where: { mockTestId } });
       return { msg: 'User has not attempted this test yet', total };
    }

    const betterAttemptsCount = await this.prisma.mockTestAttempt.count({
      where: {
        mockTestId,
        OR: [
          { score: { gt: userAttempt.score } },
          { 
            score: userAttempt.score,
            attemptedAt: { lt: userAttempt.attemptedAt }
          }
        ]
      }
    });

    const total = await this.prisma.mockTestAttempt.count({ where: { mockTestId } });
    const rank = betterAttemptsCount + 1;
    const percentile = total > 1 ? ((total - rank) / total) * 100 : 100;
    const topPercentage = (rank / total) * 100;

    return {
      rank,
      total,
      topPercentage: Math.ceil(topPercentage),
      percentile: Math.round(percentile * 10) / 10
    };
  }

  async submitExamAttempt(dto: { otrId: string, examId: number, score: number, totalMarks: number, attemptId?: number }) {
    this.logger.log(`Antigravity Debug - submitExamAttempt called with: ${JSON.stringify(dto)}`);
    // 1. Ensure user exists
    const user = await this.prisma.user.findUnique({ where: { otrId: dto.otrId } });
    if (!user) throw new NotFoundException('User with this OTR ID not found');

    // 2. Ensure "Official Assessment" category exists
    const categoryName = "Official Assessment";
    let category = await this.prisma.mockTestCategory.findUnique({
      where: { name: categoryName }
    });

    if (!category) {
      category = await this.prisma.mockTestCategory.create({
        data: { name: categoryName }
      });
    }

    // 3. Ensure a MockTest record exists for this exam
    let mockTest = await this.prisma.mockTest.findFirst({
      where: {
        examId: dto.examId,
        categoryId: category.id
      }
    });

    if (!mockTest) {
      const exam = await this.prisma.exam.findUnique({ where: { id: dto.examId } });
      mockTest = await this.prisma.mockTest.create({
        data: {
          title: `${exam?.name || 'Exam'} - Official Assessment`,
          duration: 60,
          sectionType: "Full Length",
          categoryId: category.id,
          examId: dto.examId
        }
      });
    }

    // 4. Create or update the attempt
    if (dto.attemptId) {
        return this.prisma.mockTestAttempt.update({
            where: { id: dto.attemptId },
            data: {
                score: dto.score,
                totalMarks: dto.totalMarks,
                submitTime: new Date()
            }
        });
    }

    return this.prisma.mockTestAttempt.create({
      data: {
        otrId: dto.otrId,
        mockTestId: mockTest.id,
        score: dto.score,
        totalMarks: dto.totalMarks,
        startTime: new Date(),
        submitTime: new Date()
      }
    });
  }
}
