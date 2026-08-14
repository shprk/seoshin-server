import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const LOCAL_DB_HOSTS = ['localhost', '127.0.0.1'];

// 이 스크립트는 Task 테이블을 통째로 비우므로 원격 DB에서는 기본적으로 중단한다.
function assertSeedAllowed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL must be set');
  }

  const { hostname } = new URL(url);
  if (
    LOCAL_DB_HOSTS.includes(hostname) ||
    process.env.ALLOW_REMOTE_SEED === 'true'
  ) {
    return;
  }

  throw new Error(
    `Refusing to seed non-local database (${hostname}). ` +
      'This script deletes every Task row. Set ALLOW_REMOTE_SEED=true to override.',
  );
}

async function main() {
  assertSeedAllowed();

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
      matchedParticipantNo: 'B-014',
      ageGroup: '30대',
      address: '서울시 강남구 테헤란로 1',
      letter1Arrived: true,
      letter2Arrived: false,
      letter3Arrived: false,
      memo: 'VIP',
      email: 'hong@example.com',
    },
    {
      name: '김서신',
      participantNo: 'B-014',
      matchedParticipantNo: 'A-001',
      ageGroup: '40대',
      address: '부산시 해운대구 센텀로 2',
      letter1Arrived: false,
      letter2Arrived: false,
      letter3Arrived: false,
      memo: '',
      email: '',
    },
    {
      name: '이하늘',
      participantNo: 'C-003',
      matchedParticipantNo: null,
      ageGroup: '60대 이상',
      address: '대구시 중구 동성로 3',
      letter1Arrived: false,
      letter2Arrived: true,
      letter3Arrived: false,
      memo: '오전 방문',
      email: '',
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
      },
      {
        name: '김서신',
        participantNo: 'B-014',
        matchedParticipantNo: 'A-001',
        address: '부산시 해운대구 센텀로 2',
      },
      {
        name: '미등록고객',
        participantNo: 'Z-999',
        matchedParticipantNo: null,
        address: '',
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
