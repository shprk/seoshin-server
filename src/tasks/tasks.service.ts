import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const taskSelect = {
  id: true,
  name: true,
  participantNo: true,
  matchedParticipantNo: true,
  address: true,
  letter1Arrived: true,
  letter2Arrived: true,
  letter3Arrived: true,
  barcode: true,
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

  async findByBarcode(barcode: string) {
    const task = await this.prisma.task.findFirst({
      where: { barcode },
      select: taskSelect,
      orderBy: { createdAt: 'desc' },
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
        letter1Arrived: dto.letter1Arrived ?? false,
        letter2Arrived: dto.letter2Arrived ?? false,
        letter3Arrived: dto.letter3Arrived ?? false,
        barcode: dto.barcode,
      },
      select: taskSelect,
    });
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id },
      data: dto,
      select: taskSelect,
    });
  }
}
