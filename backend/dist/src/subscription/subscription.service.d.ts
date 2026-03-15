import { PrismaService } from '../prisma/prisma.service';
export declare class SubscriptionService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }[]>;
    update(id: number, data: any): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
}
