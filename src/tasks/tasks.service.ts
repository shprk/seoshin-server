import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

const taskSelect = {
  id: true,
  name: true,
  participantNo: true,
  matchedParticipantNo: true,
  address: true,
  createdAt: true,
} as const;

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        select: taskSelect,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count(),
    ]);

    return { items, total };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      select: taskSelect,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  create(dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        name: dto.name,
        participantNo: dto.participantNo,
        matchedParticipantNo: dto.matchedParticipantNo ?? null,
        address: dto.address ?? '',
      },
      select: taskSelect,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
  }
}
