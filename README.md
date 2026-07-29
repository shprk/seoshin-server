# seoshin-server

NestJS + Prisma + Supabase (PostgreSQL) 기반 관리자 API.

## 요구 사항

- Node.js 20+
- Supabase 프로젝트 (PostgreSQL)

<!-- ## 설치

```bash
npm install
cp .env.example .env
```

`.env`에 Supabase Database URI와 JWT/관리자 계정 값을 설정합니다.

## DB 마이그레이션 & Seed

```bash
npx prisma migrate dev
npx prisma db seed
```

Seed는 관리자 계정 1개 + 샘플 고객/작업 데이터를 넣습니다.

## 실행

```bash
npm run start:dev
```

서버 기본 주소: `http://localhost:3001`  
프론트(`seoshin-admin`)의 `VITE_API_BASE_URL=http://localhost:3001`에 연결합니다.

인증이 필요한 API는 `Authorization: Bearer <accessToken>` 헤더가 필요합니다.

## API

<!-- ### Auth

#### `POST /auth/login`

```json
{
  "email": "admin@example.com",
  "password": "********"
}
```

성공 시:

```json
{
  "accessToken": "jwt-token",
  "user": {
    "accountNo": "user-id",
    "email": "admin@example.com",
    "role": ["admin"],
    "exp": 1730000000000
  }
}
```

- `400` validation 실패
- `401` 이메일/비밀번호 불일치
- `403` 비활성 계정

#### `GET /auth/me`

```json
{
  "accountNo": "user-id",
  "email": "admin@example.com",
  "role": ["admin"],
  "exp": 1730000000000
}
``` -->

### Customers (JWT 필요)

| Method | Path | 설명 |
|--------|------|------|
| GET | `/customers` | 목록 `{ items, total }` |
| GET | `/customers/:id` | 단건 |
| POST | `/customers` | 생성 |
| PATCH | `/customers/:id` | 수정 |

### Tasks (JWT 필요)

| Method | Path | 설명 |
|--------|------|------|
| GET | `/tasks` | 목록 `{ items, total }` |
| GET | `/tasks/:id` | 단건 |
| GET | `/tasks/by-barcode/:barcode` | 바코드로 최신 1건 조회 |
| POST | `/tasks` | 생성 (동일 바코드 중복 허용) |
| PATCH | `/tasks/:id` | 수정 (`letter1Arrived` 등) |

`PATCH /tasks/:id` 예:

```json
{
  "letter2Arrived": true
}
```

또는 `address`, `letter1Arrived`, `letter3Arrived`를 개별 수정할 수 있습니다.

고객과 작업은 FK로 연결하지 않습니다. 바코드는 unique가 아니라 스캔 이력을 여러 건 남길 수 있습니다. -->

<!-- ## 환경 변수

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `JWT_SECRET` | JWT 서명 비밀키 |
| `JWT_EXPIRES_IN` | 만료 시간 (기본 `1d`) |
| `PORT` | 서버 포트 (기본 `3001`) |
| `CORS_ORIGIN` | 허용 Origin (기본 `http://localhost:5173`) |
| `ADMIN_EMAIL` | Seed 관리자 이메일 |
| `ADMIN_PASSWORD` | Seed 관리자 비밀번호 | -->
