import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
export declare class TestController {
    private readonly testService;
    constructor(testService: TestService);
    create(createTestDto: CreateTestDto): Promise<{
        exam: {
            name: string;
            createdAt: Date;
            id: number;
            cutoff: number | null;
            syllabus: string | null;
            updatedAt: Date;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
        questions: {
            id: number;
        }[];
    } & {
        name: string;
        createdAt: Date;
        id: number;
        examId: number;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        exam: {
            name: string;
            createdAt: Date;
            id: number;
            cutoff: number | null;
            syllabus: string | null;
            updatedAt: Date;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
        _count: {
            questions: number;
        };
    } & {
        name: string;
        createdAt: Date;
        id: number;
        examId: number;
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__TestClient<({
        exam: {
            name: string;
            createdAt: Date;
            id: number;
            cutoff: number | null;
            syllabus: string | null;
            updatedAt: Date;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
        questions: {
            createdAt: Date;
            id: number;
            text: string;
            options: string[];
            answer: string;
            subjectId: number;
        }[];
    } & {
        name: string;
        createdAt: Date;
        id: number;
        examId: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateTestDto: UpdateTestDto): import(".prisma/client").Prisma.Prisma__TestClient<{
        name: string;
        createdAt: Date;
        id: number;
        examId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__TestClient<{
        name: string;
        createdAt: Date;
        id: number;
        examId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
