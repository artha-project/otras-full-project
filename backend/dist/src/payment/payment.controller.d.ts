import { PaymentService } from './payment.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createOrder(req: any, dto: CreateOrderDto): Promise<{
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
                id: number;
                createdAt: Date;
                title: string;
                price: number;
                features: string[];
                isRecommended: boolean;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            userId: number;
            subscriptionId: number;
            razorpayOrderId: string;
            razorpayPaymentId: string | null;
            razorpaySignature: string | null;
            amount: number;
            currency: string;
            paymentMethod: string;
        };
    }>;
    payWithCredits(req: any, dto: {
        subscriptionId: number;
    }): Promise<{
        message: string;
        payment: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            userId: number;
            subscriptionId: number;
            razorpayOrderId: string;
            razorpayPaymentId: string | null;
            razorpaySignature: string | null;
            amount: number;
            currency: string;
            paymentMethod: string;
        };
        remainingCredits: number;
    }>;
    getPaymentsByUser(userId: string): Promise<({
        subscription: {
            id: number;
            createdAt: Date;
            title: string;
            price: number;
            features: string[];
            isRecommended: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: number;
        subscriptionId: number;
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        razorpaySignature: string | null;
        amount: number;
        currency: string;
        paymentMethod: string;
    })[]>;
    getAllPayments(): Promise<({
        user: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
            preferredLanguage: string;
            credits: number;
            referralCode: string;
        };
        subscription: {
            id: number;
            createdAt: Date;
            title: string;
            price: number;
            features: string[];
            isRecommended: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: number;
        subscriptionId: number;
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        razorpaySignature: string | null;
        amount: number;
        currency: string;
        paymentMethod: string;
    })[]>;
}
