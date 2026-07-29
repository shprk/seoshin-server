import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'admin',
      isActive: true,
    },
    create: {
      email,
      passwordHash,
      name: 'Admin',
      role: 'admin',
      isActive: true,
    },
  });

  console.log(`Admin user ready: ${admin.email} (${admin.id})`);

  const customers = [
    {
      name: '홍길동',
      participantNo: 'A-001',
      phone: '010-1234-5678',
      ageGroup: '20대',
      memo: 'VIP',
    },
    {
      name: '김서신',
      participantNo: 'B-014',
      phone: '010-9876-5432',
      ageGroup: '30대',
      memo: '',
    },
    {
      name: '이하늘',
      participantNo: 'C-003',
      phone: '010-5555-1212',
      ageGroup: '40대',
      memo: '오전 방문',
    },
  ];

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { participantNo: customer.participantNo },
      update: customer,
      create: customer,
    });
  }

  console.log(`Customers ready: ${customers.length}`);

  await prisma.task.deleteMany();
  await prisma.task.createMany({
    data: [
      {
        name: '홍길동',
        participantNo: 'A-001',
        matchedParticipantNo: 'B-014',
        address: '서울시 강남구 테헤란로 1',
        letter1Arrived: true,
        letter2Arrived: false,
        letter3Arrived: false,
        barcode: 'SS-0001',
      },
      {
        name: '김서신',
        participantNo: 'B-014',
        matchedParticipantNo: 'A-001',
        address: '부산시 해운대구 센텀로 2',
        letter1Arrived: false,
        letter2Arrived: false,
        letter3Arrived: false,
        barcode: 'SS-0002',
      },
      {
        name: '미등록고객',
        participantNo: 'Z-999',
        matchedParticipantNo: null,
        address: '',
        letter1Arrived: false,
        letter2Arrived: false,
        letter3Arrived: false,
        barcode: 'SS-0003',
      },
    ],
  });
  console.log('Sample tasks created: 3');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
