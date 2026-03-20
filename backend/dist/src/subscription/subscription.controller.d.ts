import { SubscriptionService } from './subscription.service';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
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
    update(id: string, data: any): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
    remove(id: string): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
}
