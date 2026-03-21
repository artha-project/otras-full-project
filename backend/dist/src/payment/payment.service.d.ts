import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
export declare class PaymentService {
    private prisma;
    private razorpay;
    constructor(prisma: PrismaService);
    createOrder(dto: CreateOrderDto): Promise<{
        orderId: any;
        amount: any;
        currency: any;
        paymentId: number;
        keyId: string | undefined;
    }>;
    verifyPayment(dto: VerifyPaymentDto): Promise<{
        message: string;
        payment: {
            subscription: {
                createdAt: Date;
                id: number;
                title: string;
                price: number;
                features: string[];
                isRecommended: boolean;
            };
        } & {
            razorpayOrderId: string;
            razorpayPaymentId: string | null;
            razorpaySignature: string | null;
            amount: number;
            currency: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            paymentMethod: string;
            id: number;
            userId: number;
            subscriptionId: number;
        };
    }>;
    payWithCredits(userId: number, subscriptionId: number): Promise<{
        message: string;
        payment: any;
        remainingCredits: number;
    }>;
    getPaymentsByUser(userId: number): Promise<({
        subscription: {
            createdAt: Date;
            id: number;
            title: string;
            price: number;
            features: string[];
            isRecommended: boolean;
        };
    } & {
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        razorpaySignature: string | null;
        amount: number;
        currency: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        paymentMethod: string;
        id: number;
        userId: number;
        subscriptionId: number;
    })[]>;
    getAllPayments(): Promise<({
        subscription: {
            createdAt: Date;
            id: number;
            title: string;
            price: number;
            features: string[];
            isRecommended: boolean;
        };
        user: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            credits: number;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            age: number | null;
            category: string | null;
            otrId: string;
            highestDegree: string | null;
            careerPreference: string | null;
            domicile: string | null;
            pincode: string | null;
            referralCode: string;
            preferredLanguage: string;
        };
    } & {
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        razorpaySignature: string | null;
        amount: number;
        currency: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        paymentMethod: string;
        id: number;
        userId: number;
        subscriptionId: number;
    })[]>;
}
