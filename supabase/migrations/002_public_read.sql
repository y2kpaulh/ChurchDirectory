-- 비로그인(anon) 메인 화면: 공개 목록·카테고리 조회
-- Supabase SQL Editor에서 실행

DROP POLICY IF EXISTS "anon_read_public_members" ON church_members;
CREATE POLICY "anon_read_public_members" ON church_members
    FOR SELECT TO anon
    USING (is_public = true);

DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories
    FOR SELECT TO anon
    USING (true);
