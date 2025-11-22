# BackStep Backend (NodeBE)

BackStep 프로젝트의 백엔드 서버 리포지토리입니다. Node.js, Express, TypeScript를 기반으로 구축되었으며, Prisma ORM을 사용하여 MySQL 데이터베이스와 상호작용합니다.

## 🛠 기술 스택 (Tech Stack)

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: Passport.js (Google OAuth 2.0), JWT
- **Cloud Service**: AWS S3 (Image Upload)
- **API Documentation**: Swagger (OpenAPI 3.0)
- **Deployment**: AWS EC2, Nginx, PM2, GitHub Actions

## 🚀 주요 기능 (Key Features)

- **사용자 인증 (Auth)**:
  - Google 소셜 로그인
  - JWT 기반 인증 및 인가
- **프로젝트 관리 (Project)**:
  - 프로젝트 생성, 조회, 수정, 삭제 (CRUD)
  - 인기 프로젝트 조회 (좋아요 순)
  - 카테고리별 실패 경험 공유
- **사용자 활동 (User Activity)**:
  - 프로필 수정 (닉네임, 이미지, 자기소개)
  - 프로젝트 좋아요 (Helpful) 및 취소
  - 내가 쓴 글 / 좋아요한 글 / 구매한 글 조회
- **이미지 업로드 (Image)**:
  - AWS S3 Presigned URL 발급을 통한 이미지 업로드

## ⚙️ 설치 및 실행 (Installation & Run)

### 1. 사전 요구사항 (Prerequisites)
- Node.js (v18+)
- MySQL Database

### 2. 환경 변수 설정 (.env)
프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정해야 합니다.

```env
# Server
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:3001

# Database
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# Auth
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=/api/auth/google/callback
GOOGLE_LOGIN_REDIRECT_URL=http://localhost:3001/login/callback

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET_NAME=your_bucket_name

# Discord Webhook (Optional)
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

### 3. 설치 및 실행

```bash
# 의존성 설치
npm install

# Prisma 클라이언트 생성
npx prisma generate

# DB 마이그레이션 (개발 환경)
npx prisma migrate dev

# 서버 실행 (개발 모드)
npm run dev

# 빌드 및 실행 (배포 모드)
npm run build
npm start
```

## 📚 API 문서 (API Documentation)

서버를 실행한 후, 다음 주소에서 Swagger UI를 통해 API 문서를 확인하고 테스트할 수 있습니다.

- **Local**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Production**: `https://csscaps.com/api-docs`

## 📂 프로젝트 구조 (Project Structure)

```
src/
├── app.ts                # App Entry Point
├── server.ts             # Server Start
├── auth/                 # Authentication Module
├── user/                 # User Module
├── project/              # Project Module
├── image/                # Image Module
├── common/               # Common Utilities & Middlewares
├── config/               # Configuration (Swagger, etc.)
└── @types/               # TypeScript Type Definitions
prisma/
├── schema.prisma         # Database Schema
└── migrations/           # DB Migrations
```

## 👨‍💻 팀원 소개 (Team)

| 이름 (Name) | 역할 (Role) | GitHub |
| :---: | :---: | :---: |
| **원종호** | `Lead Backend` | [@GithubID](https://github.com/yee2know) |
| **정민재** | `Backend` | [@GithubID](https://github.com/milk3013) |
| **김현준** | `Backend` | [@GithubID](https://github.com/dudare) |

## 🔄 협업 방식 (Work Flow)

본 프로젝트는 **GitHub Flow** 전략을 기반으로 협업을 진행합니다.

### 1. Branch Strategy
- **main**: 배포 가능한 상태의 코드를 유지합니다.
- **feat/issue-number**: 새로운 기능 개발 시 생성합니다. (예: `feat/#1`)
- **fix/issue-number**: 버그 수정 시 생성합니다. (예: `fix/#2`)

### 2. Commit Convention
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등 (코드 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드 추가/수정
- `chore`: 빌드 업무 수정, 패키지 매니저 수정 등

### 3. Work Flow Process
1. **Issue 생성**: 개발할 기능이나 수정할 버그에 대한 이슈를 생성합니다.
2. **Branch 생성**: `main` 브랜치에서 새로운 작업 브랜치를 생성합니다.
3. **개발 및 Commit**: 작업을 진행하며 의미 있는 단위로 커밋합니다.
4. **Pull Request (PR)**: 작업이 완료되면 `main` 브랜치로 PR을 생성합니다.
5. **Code Review**: 최소 1명의 팀원들의 리뷰를 받고 피드백을 반영합니다.
6. **Merge**: 리뷰가 승인되면 `main` 브랜치로 Merge 합니다.

## 🤝 Contributing

1. 이 저장소를 Fork 합니다.
2. 새로운 Feature Branch를 생성합니다 (`git checkout -b feat/AmazingFeature`).
3. 변경 사항을 Commit 합니다 (`git commit -m 'Add some AmazingFeature'`).
4. Branch에 Push 합니다 (`git push origin feat/AmazingFeature`).
5. Pull Request를 요청합니다.

