-- 교회 직장인 디렉토리 — Supabase SQL Editor에서 한 번에 실행
-- 실행 후: Table Editor에서 테이블·데이터 확인

-- 1. 카테고리
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. 교인 직장 정보
CREATE TABLE IF NOT EXISTS church_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    company_name VARCHAR(100),
    job_title VARCHAR(100),
    business_description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_members_search
    ON church_members (is_public, category_id, company_name, name);

-- 3. 승인된 사용자(화이트리스트)
CREATE TABLE IF NOT EXISTS allowed_users (
    email VARCHAR(100) PRIMARY KEY,
    name VARCHAR(50),
    is_approved BOOLEAN DEFAULT FALSE,
    role VARCHAR(20) DEFAULT 'user'
);

-- 초기 카테고리
INSERT INTO categories (name) VALUES
    ('외식/베이커리'),
    ('IT/기술'),
    ('교육/학원'),
    ('의료/보건')
ON CONFLICT (name) DO NOTHING;

-- Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE allowed_users ENABLE ROW LEVEL SECURITY;

-- 비로그인(메인 화면): 공개 멤버·카테고리 조회
DROP POLICY IF EXISTS "anon_read_public_members" ON church_members;
CREATE POLICY "anon_read_public_members" ON church_members
    FOR SELECT TO anon
    USING (is_public = true);

DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories
    FOR SELECT TO anon
    USING (true);

-- 로그인 사용자: 공개 멤버만 조회
DROP POLICY IF EXISTS "read_public_members" ON church_members;
CREATE POLICY "read_public_members" ON church_members
    FOR SELECT TO authenticated
    USING (is_public = true);

-- 로그인 사용자: 카테고리 읽기
DROP POLICY IF EXISTS "read_categories" ON categories;
CREATE POLICY "read_categories" ON categories
    FOR SELECT TO authenticated
    USING (true);

-- 관리자: church_members 전체 CRUD
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM allowed_users
    WHERE email = (auth.jwt() ->> 'email')
      AND is_approved = true
      AND role = 'admin'
  );
$$;

DROP POLICY IF EXISTS "admin_manage_members" ON church_members;
CREATE POLICY "admin_manage_members" ON church_members
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 본인 이메일 행만 조회
DROP POLICY IF EXISTS "read_own_allowed" ON allowed_users;
CREATE POLICY "read_own_allowed" ON allowed_users
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'email' = email);

-- ⚠️ 관리자만 로그인 (role=admin). 목록 조회는 비로그인(anon) 공개.
-- INSERT INTO allowed_users (email, name, is_approved, role)
-- VALUES ('your@email.com', '관리자', true, 'admin');
