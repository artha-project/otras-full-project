import { ApplicationService } from './application.service';
export declare class ApplicationController {
    private readonly applicationService;
    constructor(applicationService: ApplicationService);
    create(body: {
        userId: number;
        examId: number;
    }): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        status: string;
        examId: number;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    }>;
    findByOtrId(otrId: string): Promise<({
        exam: {
            id: number;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        status: string;
        examId: number;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    findByUser(userId: string): Promise<({
        exam: {
            id: number;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        status: string;
        examId: number;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    findAll(): Promise<({
        user: {
            id: number;
            createdAt: Date;
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
            updatedAt: Date;
            credits: number;
            referralCode: string;
            preferredLanguage: string;
        };
        exam: {
            id: number;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        status: string;
        examId: number;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    updateStatus(id: string, statusData: any): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        status: string;
        examId: number;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    }>;
}
