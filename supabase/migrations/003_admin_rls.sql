-- 관리자(is_admin) church_members CRUD
-- Supabase SQL Editor에서 002 실행 후 Run

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
