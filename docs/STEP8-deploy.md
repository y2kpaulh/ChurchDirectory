# Step 8 — GitHub + Vercel 배포

작업 폴더: `/Users/iphong/Developer/GitProject/ChurchDirectory`

## 1. GitHub (Public)

저장소: https://github.com/y2kpaulh/ChurchDirectory

### 로컬에서 푸시 (터미널)

```bash
cd /Users/iphong/Developer/GitProject/ChurchDirectory

git add .
git status   # .env 가 목록에 없어야 함
git commit -m "feat: 교회 디렉토리 시스템 완료"

git branch -M main
git remote add origin https://github.com/y2kpaulh/ChurchDirectory.git
# 이미 origin 이 있으면: git remote set-url origin https://github.com/y2kpaulh/ChurchDirectory.git

git push -u origin main
```

---

## 2. Vercel 배포

### 2-1. Vercel 연동

1. https://vercel.com 로그인 (GitHub 계정 연동)
2. **Add New → Project**
3. 방금 만든 `church-directory` 저장소 **Import**
4. Framework: **Nuxt** (자동 감지)

### 2-2. Environment Variables

Vercel 프로젝트 설정에서 **Environment Variables** 추가:

| Name | Value |
|------|--------|
| `NUXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NUXT_PUBLIC_SUPABASE_KEY` | Supabase Publishable key |

Production · Preview · Development 모두 체크 권장.

`.env` 파일은 Vercel에 업로드하지 않습니다. 위 두 값을 직접 입력합니다.

### 2-3. Deploy

**Deploy** 클릭 → 완료 후 URL 예: `https://church-directory-xxx.vercel.app`

---

## 3. Supabase 프로덕션 URL (필수)

배포 URL을 받은 뒤 Supabase:

**Authentication → URL Configuration**

| 항목 | 추가할 값 |
|------|-----------|
| Site URL | `https://YOUR-APP.vercel.app` |
| Redirect URLs | `https://YOUR-APP.vercel.app/confirm` |

로컬 개발용은 유지:

- `http://localhost:3001`
- `http://localhost:3001/confirm`

---

## 4. 배포 후 테스트

1. `https://YOUR-APP.vercel.app/login` 접속
2. `allowed_users`에 등록된 이메일로 Magic Link 로그인
3. 메인에서 검색·카테고리 동작 확인

---

## 5. 문제 해결

| 증상 | 확인 |
|------|------|
| 빌드 실패 | Vercel Build Log에서 `NUXT_PUBLIC_*` env 누락 |
| 로그인 링크 오류 | Supabase Redirect URLs에 `/confirm` (https) |
| 목록 비어 있음 | `church_members.is_public = true` 데이터 존재 |
