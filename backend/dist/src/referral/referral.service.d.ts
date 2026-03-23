import { PrismaService } from '../prisma/prisma.service';
export declare class ReferralService {
    private prisma;
    constructor(prisma: PrismaService);
    createReferral(referrerId: number, refereeOtrId: string): Promise<{
        refereeOtrId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        creditsEarned: number;
        id: number;
        referrerId: number;
    }>;
    getReferralStats(referrerId: number): Promise<{
        totalReferrals: number;
        successReferrals: number;
        creditsEarned: number;
        mockTestsEarned: number;
        availableCredits: number;
        referralCode: string;
        referrals: {
            refereeOtrId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            creditsEarned: number;
            id: number;
            referrerId: number;
        }[];
    }>;
    getReferralHistory(referrerId: number): Promise<{
        id: number;
        friendOtrId: string;
        signupDate: Date;
        status: string;
        creditsEarned: number;
    }[]>;
    getRewards(userId: number): Promise<({
        mockTest: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            title: string;
            duration: number;
            sectionType: string;
            isProctored: boolean;
            isAdaptive: boolean;
            categoryId: number;
            examId: number | null;
        };
    } & {
        createdAt: Date;
        id: number;
        userId: number;
        mockTestId: number;
        isRedeemed: boolean;
    })[]>;
    getAllReferrals(): Promise<({
        referrer: {
            otrId: string;
            firstName: string;
            lastName: string;
        };
    } & {
        refereeOtrId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        creditsEarned: number;
        id: number;
        referrerId: number;
    })[]>;
}
