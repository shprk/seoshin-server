import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

const customerSelect = {
  id: true,
  name: true,
  participantNo: true,
  matchedParticipantNo: true,
  ageGroup: true,
  address: true,
  letter1Arrived: true,
  letter2Arrived: true,
  letter3Arrived: true,
  memo: true,
  createdAt: true,
} as const;

const UPDATABLE_FIELDS = [
  'name',
  'ageGroup',
  'matchedParticipantNo',
  'address',
  'memo',
  'letter1Arrived',
  'letter2Arrived',
  'letter3Arrived',
] as const satisfies readonly (keyof UpdateCustomerDto)[];

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

  async create(dto: CreateCustomerDto) {
    try {
      return await this.prisma.customer.create({
        data: {
          name: dto.name,
          participantNo: dto.participantNo,
          matchedParticipantNo: dto.matchedParticipantNo ?? null,
          ageGroup: dto.ageGroup,
          address: dto.address ?? '',
          memo: dto.memo ?? '',
          letter1Arrived: dto.letter1Arrived ?? false,
          letter2Arrived: dto.letter2Arrived ?? false,
          letter3Arrived: dto.letter3Arrived ?? false,
        },
        select: customerSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Participant number already exists');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);

    // 전역 ValidationPipe 설정에 의존하지 않도록 여기서도 수정 가능한 필드만 추린다.
    // id / participantNo / createdAt 은 어떤 경우에도 갱신 대상이 될 수 없다.
    const data: Prisma.CustomerUpdateInput = {};
    for (const field of UPDATABLE_FIELDS) {
      if (dto[field] !== undefined) {
        Object.assign(data, { [field]: dto[field] });
      }
    }

    return this.prisma.customer.update({
      where: { id },
      data,
      select: customerSelect,
    });
  }
}
