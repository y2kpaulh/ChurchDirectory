# Step 3 — Supabase DB·Auth 설정

작업 폴더: `/Users/iphong/Developer/GitProject/ChurchDirectory`

로컬 개발 포트: **3001** (`http://localhost:3001`)

## 1. SQL 실행

1. [Supabase Dashboard](https://supabase.com/dashboard) → 프로젝트 선택
2. 왼쪽 **SQL Editor** → **New query**
3. [supabase/schema.sql](../supabase/schema.sql) 내용 전체 복사 → 붙여넣기 → **Run**
4. 성공 시 **Table Editor**에서 `categories`, `church_members`, `allowed_users` 확인

**이미 schema.sql을 실행한 경우** — 메인 화면 비로그인 조회용 정책 추가:

5. [supabase/migrations/002_public_read.sql](../supabase/migrations/002_public_read.sql) 실행 (anon 읽기)
6. [supabase/migrations/004_grants_anon.sql](../supabase/migrations/004_grants_anon.sql) 실행 (권한 부여 — 카테고리 오류 시)
7. [supabase/migrations/003_admin_rls.sql](../supabase/migrations/003_admin_rls.sql) 실행 (관리자 성도 항목 CRUD)
8. [supabase/migrations/005_admin_categories_rls.sql](../supabase/migrations/005_admin_categories_rls.sql) 실행 (관리자 카테고리 CRUD)
9. [supabase/migrations/006_add_website_url.sql](../supabase/migrations/006_add_website_url.sql) 실행 (항목 URL 링크)
10. [supabase/migrations/007_add_cell_and_other_info.sql](../supabase/migrations/007_add_cell_and_other_info.sql) 실행 (소속 Cell · 기타 정보)

### 관리자 Google 계정 등록 (필수)

SQL Editor에서 (이메일만 본인 것으로 변경):

```sql
INSERT INTO allowed_users (email, name, is_approved, role)
VALUES ('본인@gmail.com', '이름', true, 'admin');
```

> **Google 로그인에 쓰는 Gmail과 동일한 이메일**이어야 합니다. 일반 방문자는 메인(`/`)만 이용합니다.

### 테스트용 성도 데이터 (선택)

[supabase/seed-test-members.sql](../supabase/seed-test-members.sql) 실행  
또는 Table Editor → `church_members` → Import CSV

---

## 2. Google 로그인 (관리자)

### Google Cloud Console

1. [Google Cloud Console](https://console.cloud.google.com/) → OAuth 2.0 Client ID (웹)
2. **Authorized redirect URIs**에 추가:
   - `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
3. Client ID / Secret 복사

### Supabase Dashboard

**Authentication → Providers → Google** → Enabled, Client ID/Secret 입력

**Authentication → URL Configuration**

| 항목 | 값 |
|------|-----|
| Site URL | `http://localhost:3001` (로컬) |
| Redirect URLs | `http://localhost:3001/confirm` |

배포 시 `https://church-directory-cyan.vercel.app/confirm` 추가.

---

## 3. 완료 체크리스트

- [ ] `categories`에 4개 업종 행 있음
- [ ] `allowed_users`에 Google 이메일 + `role = admin`
- [ ] `003_admin_rls.sql` 실행
- [ ] (선택) `church_members`에 `is_public = true` 샘플 1건 이상
- [ ] `002_public_read.sql` + `004_grants_anon.sql` 실행 (메인 `/` 로그인 없이 목록 표시)
- [ ] Redirect URLs에 `http://localhost:3001/confirm` 등록

---

## 4. 관리 화면

- 메인 `/` — 공개 목록 (로그인 불필요)
- `/login` — Google 관리자 로그인
- `/admin` — 성도 항목·업종 카테고리 CRUD · 엑셀 가져오기/보내기
