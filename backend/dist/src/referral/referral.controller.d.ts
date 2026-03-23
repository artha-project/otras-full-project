import { ReferralService } from './referral.service';
export declare class ReferralController {
    private readonly referralService;
    constructor(referralService: ReferralService);
    createReferral(body: {
        referrerId: number;
        refereeOtrId: string;
    }): Promise<{
        refereeOtrId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        creditsEarned: number;
        id: number;
        referrerId: number;
    }>;
    getReferralStats(referrerId: string): Promise<{
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
    getReferralHistory(referrerId: string): Promise<{
        id: number;
        friendOtrId: string;
        signupDate: Date;
        status: string;
        creditsEarned: number;
    }[]>;
    getRewards(userId: string): Promise<({
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
