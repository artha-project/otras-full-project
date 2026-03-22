import { PrismaService } from '../prisma/prisma.service';
export declare class ExamService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        subjects: {
            name: string;
            id: number;
        }[];
    } & {
        name: string;
        cutoff: number | null;
        syllabus: string | null;
        createdAt: Date;
        updatedAt: Date;
        eligibility: string | null;
        longDescription: string | null;
        noOfQuestions: number | null;
        pattern: string | null;
        shortDescription: string | null;
        applicationStatus: string;
        id: number;
    }>;
    update(id: number, updateData: any): Promise<{
        subjects: {
            name: string;
            id: number;
        }[];
    } & {
        name: string;
        cutoff: number | null;
        syllabus: string | null;
        createdAt: Date;
        updatedAt: Date;
        eligibility: string | null;
        longDescription: string | null;
        noOfQuestions: number | null;
        pattern: string | null;
        shortDescription: string | null;
        applicationStatus: string;
        id: number;
    }>;
    findAll(): Promise<({
        subjects: {
            name: string;
            id: number;
        }[];
    } & {
        name: string;
        cutoff: number | null;
        syllabus: string | null;
        createdAt: Date;
        updatedAt: Date;
        eligibility: string | null;
        longDescription: string | null;
        noOfQuestions: number | null;
        pattern: string | null;
        shortDescription: string | null;
        applicationStatus: string;
        id: number;
    })[]>;
    findOne(id: number): Promise<({
        subjects: {
            name: string;
            id: number;
        }[];
    } & {
        name: string;
        cutoff: number | null;
        syllabus: string | null;
        createdAt: Date;
        updatedAt: Date;
        eligibility: string | null;
        longDescription: string | null;
        noOfQuestions: number | null;
        pattern: string | null;
        shortDescription: string | null;
        applicationStatus: string;
        id: number;
    }) | null>;
    getRandomTest(examId: number): Promise<{
        test: {
            questions: ({
                subject: {
                    name: string;
                    id: number;
                };
            } & {
                createdAt: Date;
                id: number;
                text: string;
                options: string[];
                answer: string;
                subjectId: number;
            })[];
        } & {
            name: string;
            createdAt: Date;
            id: number;
            examId: number;
        };
        exam: {
            subjects: {
                name: string;
                id: number;
            }[];
            name: string;
            cutoff: number | null;
            syllabus: string | null;
            createdAt: Date;
            updatedAt: Date;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
            id: number;
        };
    }>;
    findByTier(tier: string): Promise<({
        subjects: {
            name: string;
            id: number;
        }[];
    } & {
        name: string;
        cutoff: number | null;
        syllabus: string | null;
        createdAt: Date;
        updatedAt: Date;
        eligibility: string | null;
        longDescription: string | null;
        noOfQuestions: number | null;
        pattern: string | null;
        shortDescription: string | null;
        applicationStatus: string;
        id: number;
    })[]>;
}
