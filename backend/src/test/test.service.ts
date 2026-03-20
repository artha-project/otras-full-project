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

    if (!exam.subjects || exam.subjects.length === 0) {
      throw new Error('This exam has no associated subjects. Please add subjects to the exam before creating a test.');
    }

    // Basic logic: Pick random questions from each subject of this exam
    const questionIds: { id: number }[] = [];
    
    // Calculate how many questions per subject we need
    // If exam.noOfQuestions is set to 100 and we have 4 subjects, that's 25 per subject
    const questionsPerSubject = Math.max(5, Math.floor((exam.noOfQuestions || 50) / exam.subjects.length));

    for (const subject of exam.subjects) {
      const questions = await this.prisma.question.findMany({
        where: { subjectId: subject.id },
        select: { id: true }
      });

      if (questions.length > 0) {
        // Simple shuffle and pick
        const shuffled = questions.sort(() => 0.5 - Math.random());
        questionIds.push(...shuffled.slice(0, questionsPerSubject).map(q => ({ id: q.id })));
      }
    }

    if (questionIds.length === 0) {
      throw new Error('No questions found for the subjects associated with this exam. Please add questions to the subjects first.');
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
        questions: {
          select: { id: true } // Don't return all question data to keep it light
        },
        exam: true
      }
    });
  }

  findAll() {
    return this.prisma.test.findMany({
      include: {
        exam: true,
        _count: {
          select: { questions: true }
        }
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
