# Step 3 — Supabase DB·Auth 설정

작업 폴더: `/Users/iphong/Developer/GitProject/ChurchDirectory`

로컬 개발 포트: **3001** (`http://localhost:3001`)

## 1. SQL 실행

1. [Supabase Dashboard](https://supabase.com/dashboard) → 프로젝트 선택
2. 왼쪽 **SQL Editor** → **New query**
3. [supabase/schema.sql](../supabase/schema.sql) 내용 전체 복사 → 붙여넣기 → **Run**
4. 성공 시 **Table Editor**에서 `categories`, `church_members`, `allowed_users` 확인

### 본인 이메일 승인 등록 (필수)

SQL Editor에서 (이메일만 본인 것으로 변경):

```sql
INSERT INTO allowed_users (email, name, is_approved, role)
VALUES ('본인@이메일.com', '이름', true, 'user');
```

### 테스트용 교인 데이터 (선택)

[supabase/seed-test-members.sql](../supabase/seed-test-members.sql) 실행  
또는 Table Editor → `church_members` → Import CSV

---

## 2. Authentication 설정

**Authentication → Providers → Email**

- Email provider: **Enabled**
- Confirm email: 프로젝트 기본값 사용 (Magic Link 동작 확인)

**Authentication → URL Configuration**

| 항목 | 값 |
|------|-----|
| Site URL | `http://localhost:3001` |
| Redirect URLs | `http://localhost:3001/confirm` |

나중에 Vercel 배포 시 `https://xxxx.vercel.app/confirm` 추가.

---

## 3. 완료 체크리스트

- [ ] `categories`에 4개 업종 행 있음
- [ ] `allowed_users`에 본인 이메일 + `is_approved = true`
- [ ] (선택) `church_members`에 `is_public = true` 샘플 1건 이상
- [ ] Redirect URLs에 `http://localhost:3001/confirm` 등록

---

## 4. 다음 단계

Step 4에서 `login.vue` / `confirm.vue`에 Magic Link 로그인 구현.
