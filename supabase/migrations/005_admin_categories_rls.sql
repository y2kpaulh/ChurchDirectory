-- 관리자: categories 추가·수정·삭제
DROP POLICY IF EXISTS "admin_manage_categories" ON categories;
CREATE POLICY "admin_manage_categories" ON categories
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

GRANT INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;
