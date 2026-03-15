import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) { }

  async create(createTestDto: CreateTestDto) {
    const { name, examId } = createTestDto;

    // Fetch subjects associated with this exam
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { subjects: true }
    });

    if (!exam) throw new Error('Exam not found');

    // Basic logic: Pick random questions from each subject of this exam
    const questionIds: { id: number }[] = [];
    for (const subject of exam.subjects) {
      const questions = await this.prisma.question.findMany({
        where: { subjectId: subject.id },
        take: 10 // Let's pick 10 random questions per subject for now
      });
      // Simple shuffle and pick
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

  findOne(id: number) {
    return this.prisma.test.findUnique({
      where: { id },
      include: {
        exam: true,
        questions: true
      }
    });
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return this.prisma.test.update({
      where: { id },
      data: updateTestDto as any
    });
  }

  remove(id: number) {
    return this.prisma.test.delete({
      where: { id }
    });
  }
}
