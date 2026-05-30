-- 관리자 1명 등록 (로그인 이메일과 동일, role=admin 필수)
-- 이메일·이름만 수정한 뒤 SQL Editor에서 Run

INSERT INTO allowed_users (email, name, is_approved, role)
VALUES (
    '본인@이메일.com',   -- ← 여기 수정
    '홍길동',            -- ← 표시 이름 (아무거나)
    true,
    'admin'
)
ON CONFLICT (email) DO UPDATE SET
    is_approved = EXCLUDED.is_approved,
    name = EXCLUDED.name,
    role = EXCLUDED.role;
