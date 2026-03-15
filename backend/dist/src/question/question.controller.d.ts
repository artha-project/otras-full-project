import { QuestionService } from './question.service';
export declare class QuestionController {
    private readonly questionService;
    constructor(questionService: QuestionService);
    create(data: any): import(".prisma/client").Prisma.Prisma__QuestionClient<{
        id: number;
        createdAt: Date;
        text: string;
        options: string[];
        answer: string;
        subjectId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(examId?: string, subjectId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        subject: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        createdAt: Date;
        text: string;
        options: string[];
        answer: string;
        subjectId: number;
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__QuestionClient<({
        subject: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        createdAt: Date;
        text: string;
        options: string[];
        answer: string;
        subjectId: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: any): import(".prisma/client").Prisma.Prisma__QuestionClient<{
        id: number;
        createdAt: Date;
        text: string;
        options: string[];
        answer: string;
        subjectId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__QuestionClient<{
        id: number;
        createdAt: Date;
        text: string;
        options: string[];
        answer: string;
        subjectId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
