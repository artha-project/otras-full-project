"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TestService = class TestService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTestDto) {
        const { name, examId } = createTestDto;
        const exam = await this.prisma.exam.findUnique({
            where: { id: examId },
            include: { subjects: true }
        });
        if (!exam)
            throw new Error('Exam not found');
        const questionIds = [];
        for (const subject of exam.subjects) {
            const questions = await this.prisma.question.findMany({
                where: { subjectId: subject.id },
                take: 10
            });
            const shuffled = questions.sort(() => 0.5 - Math.random());
            questionIds.push(...shuffled.slice(0, 5).map(q => ({ id: q.id })));
        }
        return this.prisma.test.create({
            data: {
                name,
                examId,
                questions: {
                    connect: questionIds
                }
            },
            include: {
                questions: true,
                exam: true
            }
        });
    }
    findAll() {
        return this.prisma.test.findMany({
            include: {
                exam: true,
            },
            take: 50,
            orderBy: { createdAt: 'desc' }
        });
    }
    findOne(id) {
        return this.prisma.test.findUnique({
            where: { id },
            include: {
                exam: true,
                questions: true
            }
        });
    }
    update(id, updateTestDto) {
        return this.prisma.test.update({
            where: { id },
            data: updateTestDto
        });
    }
    remove(id) {
        return this.prisma.test.delete({
            where: { id }
        });
    }
};
exports.TestService = TestService;
exports.TestService = TestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TestService);
//# sourceMappingURL=test.service.js.map