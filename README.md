# 교회 직장인 디렉토리

## 이용 방식

| 대상 | 경로 | 로그인 |
|------|------|--------|
| **누구나** | `/` (메인) | 불필요 — 공개 목록·검색·카테고리 |
| **관리자** | 톱니 → `/login` (Google) → `/admin` | 필요 — 항목 CRUD · 엑셀 가져오기/보내기 |

`allowed_users` 테이블에 **`role = 'admin'`** 인 이메일만 관리자 로그인이 됩니다.

## 작업 폴더 (중요)

**이 프로젝트의 작업 디렉터리:**

```text
/Users/iphong/Developer/GitProject/ChurchDirectory
```

```bash
cd /Users/iphong/Developer/GitProject/ChurchDirectory
npm run dev
```

| 경로 | 설명 |
|------|------|
| **GitProject/ChurchDirectory** | ✅ **지금 사용하는 폴더** (GitHub 연동) |
| `Developer/Project/church-directory` | 예전 작업 복사본 — 사용하지 않음 |
| `~/church-directory` | 예전 Nuxt Welcome 템플릿 — 사용하지 않음 |

**GitHub:** https://github.com/y2kpaulh/ChurchDirectory (Public)

Cursor에서 **File → Open Folder** 로 `GitProject/ChurchDirectory` 를 열면 IDE 작업 경로도 맞춰집니다.

로컬 개발 URL: **http://localhost:3001** (3000이 다른 프로젝트에 쓰일 때)

```bash
lsof -ti:3000 | xargs kill -9   # 필요 시 예전 서버 종료
```

## Nuxt 4 디렉터리 구조

```text
ChurchDirectory/
├── app/
│   ├── app.vue
│   └── pages/
│       ├── index.vue
│       ├── index.vue      # 공개 목록
│       ├── login.vue      # 관리자 로그인
│       ├── confirm.vue
│       └── admin/index.vue
├── server/api/check-user.get.ts
├── supabase/
├── .env              # Git 제외
├── nuxt.config.ts
└── package.json
```

## Setup

```bash
npm install
cp .env.example .env   # Supabase 값 입력
npm run dev
```

## Git (로컬)

```bash
git status
git remote -v   # origin → github.com/y2kpaulh/ChurchDirectory
```

배포: [docs/STEP8-deploy.md](docs/STEP8-deploy.md)
