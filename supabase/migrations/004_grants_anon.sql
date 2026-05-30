-- anon/authenticated 역할에 테이블 SELECT 권한 (RLS 정책과 함께 필요)
-- 002 실행 후에도 카테고리 오류가 나면 이 파일도 Run

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public.categories TO anon, authenticated;
GRANT SELECT ON TABLE public.church_members TO anon, authenticated;
