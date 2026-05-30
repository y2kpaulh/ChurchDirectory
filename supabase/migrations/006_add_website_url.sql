-- 항목별 대표 URL (홈페이지·블로그·SNS 등)
ALTER TABLE church_members
  ADD COLUMN IF NOT EXISTS website_url TEXT;

COMMENT ON COLUMN church_members.website_url IS '선택: 홈페이지·블로그·SNS 등';
