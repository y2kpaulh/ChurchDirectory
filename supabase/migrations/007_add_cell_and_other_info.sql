-- 소속 Cell · 기타 정보
ALTER TABLE church_members
  ADD COLUMN IF NOT EXISTS cell_info TEXT,
  ADD COLUMN IF NOT EXISTS other_info TEXT;

COMMENT ON COLUMN church_members.cell_info IS '소속 Cell (예: 청년부 1셀)';
COMMENT ON COLUMN church_members.other_info IS '기타 참고 사항';
