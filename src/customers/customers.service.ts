import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

const customerSelect = {
  id: true,
  name: true,
  participantNo: true,
  phone: true,
  ageGroup: true,
  memo: true,
  createdAt: true,
} as const;

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        select: customerSelect,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count(),
    ]);

    return { items, total };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      select: customerSelect,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        name: dto.name,
        participantNo: dto.participantNo,
        phone: dto.phone,
        ageGroup: dto.ageGroup,
        memo: dto.memo ?? '',
      },
      select: customerSelect,
    });
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);

    return this.prisma.customer.update({
      where: { id },
      data: dto,
      select: customerSelect,
    });
  }
}
