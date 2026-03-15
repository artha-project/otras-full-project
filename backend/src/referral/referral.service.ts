import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReferralService {
  constructor(private prisma: PrismaService) {}

  async createReferral(referrerId: number, refereeOtrId: string) {
    return this.prisma.referral.create({
      data: {
        referrerId,
        refereeOtrId,
        status: 'Joined',
      },
    });
  }

  async getReferralStats(referrerId: number) {
    const [referrals, referrer] = await Promise.all([
      this.prisma.referral.findMany({ where: { referrerId } }),
      this.prisma.user.findUnique({
        where: { id: referrerId },
        select: { credits: true, referralCode: true },
      }),
    ]);

    const totalReferrals = referrals.length;
    const successReferrals = referrals.filter(r => r.status === 'Qualified Referral').length;
    const creditsEarned = referrals.reduce((sum, r) => sum + (r.creditsEarned || 0), 0);
    const mockTestsEarned = Math.floor(successReferrals / 10);

    return {
      totalReferrals,
      successReferrals,
      creditsEarned,
      mockTestsEarned,
      availableCredits: referrer?.credits ?? 0,
      referralCode: referrer?.referralCode ?? '',
      referrals,
    };
  }

  async getReferralHistory(referrerId: number) {
    const referrals = await this.prisma.referral.findMany({
      where: { referrerId },
      orderBy: { createdAt: 'desc' },
    });

    return referrals.map(r => ({
      id: r.id,
      friendOtrId: r.refereeOtrId,
      signupDate: r.createdAt,
      status: r.status,
      creditsEarned: r.creditsEarned || 0,
    }));
  }

  async getRewards(userId: number) {
    return this.prisma.referralReward.findMany({
      where: { userId },
      include: { mockTest: true },
    });
  }

  async getAllReferrals() {
    return this.prisma.referral.findMany({
      include: {
        referrer: {
          select: { firstName: true, lastName: true, otrId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
